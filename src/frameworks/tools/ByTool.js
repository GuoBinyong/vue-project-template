/**
 * 定义可监听的属性
 *
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param prop : string   必选；要定义的属性的名称。
 * @param options ?: {ready ?:string,noEvent ?:boolean,event ?:string,newValueKey ?:string,oldValueKey ?:string,getDefault ?:(thisValue)=>PropValue}     可选；配置选项；各个选项的说明如下；
 * @property  ready ?:string    可选；默认值：prop + "Ready" ；ready属性的属性名字；
 * @property  noEvent ?:boolean    可选；默认值：false ；是否要给 prop 属性增加值变更事件；
 * @property  event ?:string    可选；默认值：prop +  "Change" ；prop变更事件的名字；
 * @property  newValueKey ?:string    可选；默认值："value" ；prop变更事件的事件对象中保存新值的属性名字；
 * @property  oldValueKey ?:string    可选；默认值："oldValue" ；prop变更事件的事件对象中保存旧值的属性名字；
 * @property  getDefault ?:(thisValue)=>PropValue    可选；在获取 prop 属性的值时，如果 prop 属性的值不存在 ，则会通过 该函数获取默认的值；
 *
 *
 * @returns obj : Object  被传递给函数的对象。
 */
export function defineListenableProperty(obj,prop,options){
  let {ready:readyName = prop + "Ready",noEvent,event:eventName = prop +  "Change",newValueKey = "value",oldValueKey = "oldValue",getDefault} = options || {};
  let priReadyName = "_" + readyName;
  let priProp = "_" + prop;



  /**
   * 给 obj 定义 ready 计算属性 ，用于获取客户端的准备状态的promise ，当访问 ready 时，如果 ready 不存在，则会自动创建
   */
  Object.defineProperty(obj, readyName, {
    configurable:true,
    enumerable:true,
    get: function () {
      let _this = this || window;
      if (!_this[priReadyName]) {
        let propValue = _this[priProp];
        if (propValue){
          _this[priReadyName] = Promise.resolve(propValue);
        }else {
          _this[priReadyName] = createControllablePromise();
        }

      }
      return _this[priReadyName];
    },
    set:function (newValue) {
      let _this = this || window;
      _this[priReadyName] = newValue;
    }
  });



  //创建 prop 的 get 方法
  if (getDefault){

    var propGetter = function () {
      let _this = this || window;
      if (!_this[priProp] && getDefault) {
        _this[prop] = getDefault.call(_this,_this);
      }
      return _this[priProp];
    }

  }else {

    propGetter = function () {
      let _this = this || window;
      return _this[priProp];
    }

  }


  //创建 prop 的 set 方法

  if (noEvent){


    var propSetter =  function (newValue) {
      let _this = this || window;
      if (newValue && newValue !== _this[priProp]) {


        let oldValue = _this[priProp];
        _this[priProp] = newValue;

        let httpReady = _this[readyName];
        if (httpReady.resolve) {
          httpReady.resolve(newValue);
        }else {
          _this[readyName] = Promise.resolve(newValue);
        }

      }
    }

  }else {


    propSetter =  function (newValue) {
      let _this = this || window;
      if (newValue && newValue !== _this[priProp]) {


        let oldValue = _this[priProp];
        _this[priProp] = newValue;

        let httpReady = _this[readyName];
        if (httpReady.resolve) {
          httpReady.resolve(newValue);
        }else {
          _this[readyName] = Promise.resolve(newValue);
        }

        //派发 change 事件
        let change = new Event(eventName, {"bubbles": true});
        change[newValueKey] = newValue;
        change[oldValueKey] = oldValue;
        window.dispatchEvent(change);


      }
    }

  }





  /**
   * 给 obj 对象 添加计算属性 prop ，用以获取 prop
   *
   * 注意：
   * 当 prop 的值变更时，会在 window 上触发该属性的 change 事件
   * 通过事件的 event[newValueKey] 可能获取改变后的新值
   * 通过事件的 event[oldValueKey] 可能获取改变前的旧值
   */
  Object.defineProperty(obj, prop, {
    configurable:true,
    enumerable:true,
    get: propGetter,
    set: propSetter
  });


  return obj;
}





/**
 * 批量定义可监听的属性
 *
 * 接口1：defineListenableProperties(obj,propOptions)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propOptions : {propName:options}   必选；要定义的属性的配置对象；以该配置对象的属性属性为 要配置的属性的名字，以其值为 本配置的属性的 配置选项
 * @returns obj : Object  被传递给函数的对象。
 *
 *
 * 接口2：defineListenableProperties(obj,propArray,options)
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param propArray : [string]   必选；要在其上定义的属性的名字列表。
 * @param options ?: {ready ?:string,noEvent ?:boolean,event ?:string,newValueKey ?:string,oldValueKey ?:string,getDefault ?:(thisValue)=>PropValue}     可选；配置选项；各个选项的说明如下；
 *
 * @returns obj : Object  被传递给函数的对象。
 */
export function defineListenableProperties(obj,props,options){

  var propsObj = props;
  if (Array.isArray(props)) {
    propsObj = props.reduce(function (total,propName) {
      total[propName] = options;
      return total;
    },{});
  }


  Object.keys(propsObj).forEach(function (propName) {
    let propOpts = propsObj[propName];
    defineListenableProperty(obj,propName,propOpts);
  });

  return obj;
}


/**
 * defineListenablePropertyGetter(obj, prop, getDefault, asGetter)
 * 定义可监听属性的 getter ； 该方法一般经常用于：一些可监听属性在被定义时，还不能定义 getDefault 选项，只能在稍后某个时刻定义 getDefault 选项，此时便可用此函数来简化重新定义 getter 的操作；
 * @param obj : Object   必选；要在其上定义属性的对象。
 * @param prop : string   必选；要定义的属性的名称。
 * @param  getDefault ?:(thisValue)=>PropValue    可选；在获取 prop 属性的值时，如果 prop 属性的值不存在 ，则会通过 该函数获取默认的值；
 * @param asGetter ?: boolean    可选；是否将 getDefault 作为 getter
 */
export function defineListenablePropertyGetter(obj, prop, getDefault, asGetter) {

  let priProp = "_" + prop;

  if (asGetter) {
    var propGetter = getDefault;
  } else if (getDefault) {

    propGetter = function () {
      let _this = this || window;
      if (!_this[priProp] && getDefault) {
        _this[prop] = getDefault.call(_this, _this);
      }
      return _this[priProp];
    }

  } else {

    propGetter = function () {
      let _this = this || window;
      return _this[priProp];
    }

  }


  Object.defineProperty(obj, prop, {
    configurable:true,
    enumerable:true,
    get: propGetter
  });
}


/**
 * 生成唯一的标识符
 * @returns {string}
 */
export function createUniqueIdentifier() {
  var currentDate = new Date();
  return currentDate.getTime().toString() + Math.random();
}


/**
 * 加载脚本文件
 * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
 * @return {HTMLScriptElement}
 */
export function loadScript(scriptProps) {
  if (typeof scriptProps != "object"){
    scriptProps = {src:scriptProps};
  }

  var {src,...otherPross} = scriptProps;
  var scriptEle = document.createElement("script");
  Object.assign(scriptEle,otherPross);
  scriptEle.src = src;
  document.body.appendChild(scriptEle);
  return scriptEle;
}






/**
 * prohibitWindowHeightChangeWhenInput(cancel)
 * 禁止当弹出键盘时 winodw 窗口改变高度
 * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
 */
export function prohibitWindowHeightChangeWhenInput(cancel) {

  if (cancel){

    var focusinHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__;
    if (focusinHandler){
      document.removeEventListener("focusin",focusinHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }


    var focusoutHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__;
    if (focusoutHandler){
      document.removeEventListener("focusin",focusoutHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }

    return;
  }

  // focusin 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusin_Handler__(event) {
    var htmlDom = document.documentElement;
    var htmlStyle = htmlDom.style;
    var bodyDom = document.body;
    var bodyStyle = bodyDom.style;

    //保存原始样式；
    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = {
      html:htmlStyle.height,
      body:bodyStyle.height
    };

    //设置html和body的高度为窗口变化前的空度
    var compStyleOfHtml = window.getComputedStyle(htmlDom);
    htmlStyle.height = compStyleOfHtml.height;
    var compStyleOfBody = window.getComputedStyle(bodyDom);
    bodyStyle.height = compStyleOfBody.height;
  };

  //把事件加到 document 是为加快事件的处理速度
  //添加 focusin 事件处理器
  document.addEventListener("focusin",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__);





  // focusout 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusout_Handler__(event) {
    //还原html 和 body 的原始高度
    var oriHeightStyle = prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ || {html: null,body: null} ;

    document.documentElement.style.height = oriHeightStyle.html;
    document.body.style.height = oriHeightStyle.body;

    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = null;
  };

  //添加 focusout 事件处理器
  document.addEventListener("focusout",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__);


}
