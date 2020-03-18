
import {ViewBox} from 'vux'
import {configSameVnodeContext} from ':tools/VNode' ;

/**
 *
 * 创建自定义的 ViewBox 组件
 *
 * 接口1:
 * customViewBox(getTemplateDataHandle , name = "ByViewBox")
 * @param getTemplateDataHandle      可选；获取模板数据的回调函数
 * @param name ? : string    可选，默认值："ByViewBox" ； 自定义的 ViewBox 组件的名字
 * @returns VueComponentOptions  返回Vue组件的选项对象
 *
 *
 * 接口2:
 * customViewBox(templateData , name = "ByViewBox")
 * @param getTemplateDataHandle      可选；模板数据
 * @param name ? : string    可选，默认值："ByViewBox" ； 自定义的 ViewBox 组件的名字
 * @returns VueComponentOptions  返回Vue组件的选项对象
 *
 *
 * 接口3:
 * customViewBox(getTemplateData , name = "ByViewBox")
 * @param getTemplateData : [TemplateData|getTemplateDataHandle]      可选；数组；该数组可以包含 模版数据 templateData 或者 获取模板数据的回调函数 getTemplateDataHandle； 模版数据 templateData 会被合并, 模板数据的回调函数 getTemplateDataHandle 返回的模块数据会传给下一个 getTemplateDataHandle ；
 * @param name ? : string    可选，默认值："ByViewBox" ； 自定义的 ViewBox 组件的名字
 * @returns VueComponentOptions  返回Vue组件的选项对象
 *
 *
 *
 *
 *
 * getTemplateDataHandle(templateData,ViewBoxInstance,createElement)=>TemplateData
 * @param templateData : TemplateData    被之前 getTemplateDataHandle 处理过的 模板数据
 * @param ViewBoxInstance : ViewBoxInstance    自定义的 ViewBox 组件的实例对象
 * @param createElement : function    vue 的 createElement 函数
 * @returns TemplateData : {
 *            slots:{ header:[],bottom:[],defaultSlot:[] } , //插槽
 *            ...   //其它属性同 createElement 的第2个参数的属性一样，详见： https://cn.vuejs.org/v2/guide/render-function.html
 *            }      返回自定义的 ViewBox 组件的 模块数据
 *
 *
 * 注意：
 * 如果把该组件定义成函数式组件，则会出现：当把该组件嵌套使用时，内层 ViewBox 不能正常分发插槽的情况；
 */
export default function customViewBox(getTemplateData , name = "ByViewBox") {

  let getTemplateDataArray = null;

  if (null == getTemplateData) {
    getTemplateDataArray = [];
  }else if (Array.isArray(getTemplateData)){
    getTemplateDataArray = getTemplateData;
  }else {
    getTemplateDataArray = [getTemplateData];
  }


  let ByViewBox = {
    name:name,
    render:function (createElement) {

      //获取模板数据
      let customTemplateData = getTemplateDataArray.reduce((tempData, currGetTemplateData)=>{

        let currTempData = {};

        let getTempDataType = typeof currGetTemplateData ;

        switch (getTempDataType) {
          case "function":{
            currTempData = currGetTemplateData.call(this,tempData,this,createElement);
            break;
          }

          case "object":{
            currTempData = currGetTemplateData;
            break;
          }

        }


        /*//合并模版数据
        let tdSlots = tempData.slots;
        let ctdSlots = currTempData.slots;

        if  (tdSlots && ctdSlots){
          var finalSlots = {...tdSlots,...ctdSlots};
        }

        if (finalSlots) {
          currTempData.slots = finalSlots;
        }*/


        tempData = Object.assign(tempData,currTempData) ;

        return tempData;
      }, {});




      //默认的模板数据
      if  (customTemplateData) {
        var {slots,...templateData} = customTemplateData;
      }else {
        templateData = {};
      }

      if (!templateData.props) {
        templateData.props = {...this.$attrs};
      }

      if (!slots) {
        slots = this.$slots ;
      }


      //创建虚拟Dom
      let {header = [],bottom = [],default:defaultSlot = []} = slots;
      let slotList = [...header, ...bottom, ...defaultSlot];

      let viewBoxVN = createElement(ViewBox,templateData,slotList);
      viewBoxVN = configSameVnodeContext(viewBoxVN,this.$vnode);

      return viewBoxVN;
    }

  };


  return ByViewBox;
}
