if (!window.EventTarget) {
  /*
  * 目前发现在Ios8的浏览器中是没有 EventTarget 类型的，Node 类型直接继承 Object ；
  * */
  window.EventTarget = Object;
}


/*
* 使用属性描述来定义属性，为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；
* */
let propertyDescriptors = {
  /**
   * 兼容方法：为事件添加事件处理器
   * @param event : string 必需。描述事件名称的字符串。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必需。描述了事件触发后执行的函数。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddEventListener: {
    enumerable: false,
    value: function (event, handler, useCapture) {
      if (this.addEventListener) {
        this.addEventListener(event, handler, useCapture);
      } else if (this.attachEvent) {
        this.attachEvent("on" + event, handler);
      } else {
        this["on" + event] = handler;
      }
    }
  },

  /**
   * 兼容方法：移除事件处理器
   * @param event : string 必须。要移除的事件名称。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必须。指定要移除的函数。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveEventListener: {
    enumerable: false,
    value: function (event, handler, useCapture) {
      if (this.removeEventListener) {
        this.removeEventListener(event, handler, useCapture);
      } else if (this.attachEvent) {
        this.detachEvent("on" + event, handler);
      } else {
        this["on" + event] = null;
      }
    }
  },



  /**
   * 兼容方法：为多个事件添加事件处理器
   * @param eventList : Array<string> 必需。事件名称数组。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必需。描述了事件触发后执行的函数。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddListenerForMultipleEvent: {
    enumerable: false,
    value: function (eventList, handler, useCapture) {
      eventList.forEach((event)=>{
        this.byAddEventListener(event,handler,useCapture);
      });
    }
  },



  /**
   * 兼容方法：移除事件处理器
   * @param eventList : Array<string> 必需。需要移除的事件名称数组。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handler : function  必须。指定要移除的函数。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveListenerForMultipleEvent: {
    enumerable: false,
    value: function (eventList, handler, useCapture) {
      eventList.forEach((event)=>{
        this.byRemoveEventListener(event,handler,useCapture);
      });
    }
  },





  /**
   * 兼容方法：为单个事件添加多个事件处理器
   * @param event : string 必需。描述事件名称的字符串。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handlerList : Array<function>  必需。需要添加的事件处理器数组。
   * @param useCapture : boolean 可选。布尔值，指定事件是否 在捕获或冒泡阶段执行。
   */
  byAddMultipleListenerForEvent: {
    enumerable: false,
    value: function (event, handlerList, useCapture) {
      handlerList.forEach((handler)=>{
        this.byAddEventListener(event,handler,useCapture);
      });
    }
  },



  /**
   * 兼容方法：移除事件处理器
   * @param event : string 必须。要移除的事件名称。注意： 不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
   * @param handlerList : Array<function>  必需。需要移除的事件处理器数组。
   * @param useCapture : boolean 可选。布尔值，指定移除事件句柄的阶段。
   */
  byRemoveMultipleListenerForEvent: {
    enumerable: false,
    value: function (event, handlerList, useCapture) {
      handlerList.forEach((handler)=>{
        this.byRemoveEventListener(event,handler,useCapture);
      });
    }
  },




};


Object.defineProperties(EventTarget.prototype, propertyDescriptors);










/**
 * 创建并返回一个指定次数的事件监听器
 * @param handler : (event:Event, ...paramList)=>Void     用户的自定义的事件处理程序；
 * @param times : number    事件的触发次数
 * @param timeout : number    事件的有效时长
 * @param paramList : Array    自定义参数列表，该列表中的所有元素都会作为 handler 的参数跟在 event 事件对象后面；
 * @returns manyTimesEventListener : (event:Event)=>Void     可直接被当作事件处理程序的函数；
 *
 */
window.createManyTimesEventListener = function(handler,times,timeout,paramList) {

  times = times == undefined ? 1 : times ;
  timeout = timeout == undefined ? 300 : timeout ;

  var eventMap = {};


  /**
   * 被创建的事件监听器
   * @param event : Event   事件对象
   */
  var  manyTimesEventListener = function(event) {

    var eventType = event.type ;
    var eventList = eventMap[eventType];
    if (!eventList){
      eventList = [] ;
      eventMap[eventType] = eventList ;
    }



    //找出事件的 type、target、currentTarget 都相同的事件对象；
    var sameEvent = eventList.find(function(eventItem, index){
      return eventItem.target == event.target && eventItem.listenTarget == event.currentTarget ;
    });

    if (sameEvent) {
      sameEvent.currentTimes++ ;   //增加点击次数
    }else {  //事件初次触发

      /**
       * 把 currentTimes 记录在 sameEvent 中；
       * 把 currentTarget 保存在 listenTarget 属性中；因为事件响应链结束后，事件对象的 currentTarget 会被释放；
       * @property currentTimes : number   记录相应事件的触发次数
       */
      sameEvent = event ;
      sameEvent.currentTimes = 1;
      sameEvent.listenTarget = sameEvent.currentTarget ;

      //设置计时器
      setTimeout((currentEvent)=> {
        var currentTimes = currentEvent.currentTimes ;
        if (currentTimes == times) { //符合次数才执行真正的事件处理函数
          var handlerParamListh = paramList ? [currentEvent].concat(paramList) : [currentEvent] ;   //不能更改 paramList ，因为下次调用时还会用到
          handler.apply(this,handlerParamListh);
        }

        currentEvent.listenTarget = null ;
        var myEventTypeList = eventMap[currentEvent.type];
        var currentEventIndex = myEventTypeList.indexOf(currentEvent);
        myEventTypeList.splice(currentEventIndex,1);


      },timeout,sameEvent);


      eventList.push(sameEvent);
    }



  };


  return manyTimesEventListener ;

};
