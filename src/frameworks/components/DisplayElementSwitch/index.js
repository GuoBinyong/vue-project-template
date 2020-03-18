/**
 * DisplayElementSwitch 封装实现了开关显示一个元素的逻辑，可用于全局的loading提示等；
 */
export default class DisplayElementSwitch {


  /**
   * @param props ?: DisplayElementSwitchProps    配置 DisplayElementSwitch 实例属性的对象；
   *
   * DisplayElementSwitchProps = {ele,duration,getOffset,updateOptions}
   */
  constructor(props){
    Object.assign(this,props);
  }


  /**
   * duration ?: number  显示的持续时间；只有当数值 大于 0 时才生效
   */
  duration;


  /**
   * container ReadOnly : HTMLDivElement    只读；获取容器元素
   */
  get container(){
    if  (!this._container){
      var _container = document.createElement("div");
      _container.className = "display-element-switch";
      _container.style.display = "none";
      this._container = _container;
    }
    return this._container;
  }


  /**
   * isShow ReadOnly : boolean   是否在显示
   */
  get isShow(){
    return  this.container.style.display != "none";
  }



  /**
   * getOffset : (showOptions,container,displayElementSwitch)=>OffsetStyle
   * OffsetStyle = {left:string, right:string, top:string, bottom:string}
   */
  getOffset;


  /**
   * 更新容器元素的位置
   */
  updatePosition(showOpts){

    if (this.getOffset) {
      var offset = this.getOffset(showOpts,container, this);
      if (offset) {
        let {left, right, top, bottom} = offset;

        var container = this.container;
        var compuStyle = getComputedStyle(container);

        let {left: oldLeft, right: oldRight, top: oldTop, bottom: oldBottom} = compuStyle;
        var style = container.style;

        if (left != undefined && left != oldLeft) {
          style.left = left;
        }

        if (right != undefined && right != oldRight) {
          style.right = right;
        }


        if (top != undefined && top != oldTop) {
          style.top = top;
        }


        if (bottom != undefined && bottom != oldBottom) {
          style.bottom = bottom;
        }

      }
    }

  }


  /**
   * ele ?: Ele | [Ele]    可选；默认值：document.body；  挂载 容器元素 container 的元素 ；如果是数组类型，则会优先使用第一个能查找到的 dom 元素来作为挂载元素，即：相当于备用挂载元素的列表
   * Ele = Selector | Dom
   */
  ele;

  /**
   * eleDom : Element    获取 ele 对应的dom 元素
   */
  get eleDom(){

    var eleList = this.ele;

    if (eleList){
      if (!Array.isArray(eleList)){
        eleList = [eleList];
      }

      var eleDom = eleList.find(function (ele) {
        return typeof ele == "string" ? document.querySelector(ele) : ele;
      });
    }


    return eleDom ? eleDom : document.body;
  }


  /**
   * 挂载 容器元素 container 到 ele 上；即将 容器元素 追加为 ele 的子元素
   * @param ele ?: Ele    可选；挂载 容器元素 container 的元素;
   * @return {DisplayElementSwitch}
   */
  mount(ele){
    if (arguments.length > 0){
      this.ele = ele;
    }

    let container = this.container;
    let eleDom = this.eleDom;
    if  (container.parentElement != eleDom){
      eleDom.appendChild(container);
    }

    return this;
  }



  /**
   * updateOptions : (showOptions,container,displayElementSwitch)=>Void
   */
  updateOptions;


  /**
   * 显示
   * @param showOpts ? : ShowOptions  显示选项
   *
   * ShowOptions = {...DisplayElementSwitchProps,...自定义选项}
   */
  show(showOpts){
    Object.assign(this,showOpts);
    this.mount();
    this.updatePosition(showOpts);

    let container = this.container;
    container.style.display = "block";

    this.updateOptions(showOpts,container,this);


    if (this.duration > 0){
      setTimeout(()=>{
        this.hide();
      },this.duration);
    }
  }

  /**
   * 隐藏
   */
  hide(){
    this.container.style.display = "none";
  }

}
