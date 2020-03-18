/**
 * 给 window 对象添加成员
 *
 * 注意：在给window添加成员时，在计算属性或者方法中尽量用要用this来指示window；因为，当全局直接访问这些成员，并非通过属性的方法访问时，在有些浏览器中会因为 this 为 undefined 而报错
 */
Object.defineProperties(window, {


  /**
   * shareInst：计算属性 ，用于存储共享的实例 ，当访问 shareInst 时，如果 shareInst 不存在，则会取创建
   */
  shareInst: {
    get: function () {
      let _this = this || window ;
      if (!_this._shareInst) {
        _this._shareInst = {};
      }
      return _this._shareInst;
    }
  },



  /**
   * shareData：计算属性 ，用于存储共享的数据 ，当访问 shareData 时，如果 shareData 不存在，则会取创建；
   */
  shareData: {
    get: function () {
      let _this = this || window ;

      if (!_this._shareData) {
        _this._shareData = {};
      }
      return _this._shareData;
    },


    /**
     *  如果给 shareData 赋值，只有新值是对象类型时才会生效，并且会把新值的属性添加到 原来的 shareData 对象中；
     */
    set: function (newValue) {
      if (newValue instanceof Object) {
        let _this = this || window ;
        Object.assign(_this.shareData, newValue);
      }
    }

  }




});


/**
 * 通过把值转换成JSON字符来判断是否相等
 * @param value1 : any
 * @param value2 : any
 * @returns boolean
 *
 *
 * 注意：
 * - 方法能用于判断对象的内容是否相等，相等的条件是：这2个对象拥有相同的属性 和 属性值，且属性及属性的属性 的添加顺序是一致的；即：当两个对象的拥有相同的属性和属性值时，如果属性的定义的顺序不同，该方法会返回 false；
 * - 该方法依赖于 JSON.stringify() 的逻辑；
 */
window.isEqualOfJSON = function isEqualOfJSON(value1, value2) {
  return JSON.stringify(value1) == JSON.stringify(value2);
}




/**
 * multipleLoop(option)=> stopLoop()
 * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
 * @param option : {loopCall,complete,stepComplete,thisValue,total,step,delay}   选项对象
 * @property option.loopCall : (index,stepCount,total)=>stopInfo : any  必选；每次循环的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
 * @property option.stepComplete ？ : (index,stepCount,total)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
 * @property option.complete ？: (stopInfo,index,stepCount,total)=>Void  可选；循环结束时的回调函数； 入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数；
 * @property option.thisValue ? : any   loopCall、complete、stepComplete 回调函数的this的值；
 * @property option.total ? : number   可选；默认值：无穷大 Number.POSITIVE_INFINITY ; 设置总数循环次数；
 * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
 * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
 * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
 */


window.multipleLoop = function multipleLoop({loopCall,complete,stepComplete,thisValue,total=Number.POSITIVE_INFINITY,step = 50,delay = 0}) {


  let index = 0;
  let stepCount = 0;   //已经完成了多少批遍历


  /**
   * 设置是否要停止循环；
   *
   * 之所以通过函数来设置，而不是直接给stop变量赋值，是因为：
   * - 确定 结束循环时 只调用一次  complete ；
   */
  let stop = false;    //停止循环的开关；表示是否终止循环；
  function setStop(newValue){
    if (newValue){
      stop = newValue;

      if (complete) {
        complete.call(thisValue,stop,index,stepCount,total);
      }
    }
  }


  /**
   * 是否需要循环；
   * @returns boolean
   *
   * 之所以定义成函数形式，而不定义成变量，是因为：
   * - 减少代码冗余；
   * - 确定 结束循环时 只调用一次  complete ；
   */
  function loop(){
    let needLoop = index < total;

    if (!needLoop && complete) {
      complete.call(thisValue,false,index-1,stepCount,total);
    }
    return needLoop
  }


  let timeoutId = null;






  /**
   * 自调用单次循环
   */
  function atuoSingleLoop() {
    stepCount++;

    let singleTotal = Math.min(index + step,total);

    function singleLoop(){return index < singleTotal}

    while (singleLoop() && !stop){
      setStop(loopCall.call(thisValue,index,stepCount,total));
      index++;
    }

    if (stepComplete){
      setStop(stepComplete.call(thisValue,index-1,stepCount,total));
    }


    if (loop() && !stop){
      timeoutId = setTimeout(atuoSingleLoop,delay);
    }
  }


  /**
   * 停止循环
   */
  function stopLoop(stopInfo) {
    if (!stopInfo){
      stopInfo = true;
    }

    clearTimeout(timeoutId);
    setStop(stopInfo);
  }



  if (loop()){ //开始循环
    atuoSingleLoop();
  }


  return stopLoop;
};







/**
 * safelyIterate(iterable,operation, thisValue)
 * 对 iterable  进行安全的迭代；与 for...of 的区别是：safelyIterate 能保证会迭代过程不会受 operation 中的行为的影响从而迭代每一个元素；
 * @param iterable : Iterable   必选； 可迭代的对象；
 * @param operation : (currentValue,currentIndex,iterable)=>boolean | undefined     执行的操作， 该函数的返回值表示是否要过滤出该元素
 * @param thisValue ? : any   可选，默认值是 iterable ；操作 operation 的 this 值
 * @returns [Item]  返回被 operation 过滤出的元素
 *
 *
 * operation(currentValue,currentIndex,iterable)=>boolean | undefined
 * @param currentValue : any   调用 operation 时的元素的值；
 * @param currentIndex : number     currentValue 在原始 iterable 中 对应的迭代索引值；
 * @param iterable : Iterable   被迭代的 iterable ；
 * @returns boolean | undefined  表示是否要过滤出 currentValue ；
 *
 */
window.safelyIterate = function safelyIterate(iterable,operation, thisValue) {

    if (thisValue == undefined) {
      thisValue = iterable;
    }

    let arrayCopy = [];

    for (let value of iterable){
      arrayCopy.push(value);
    }

    let filterItem = arrayCopy.filter(function (currentValue) {
      let currentIndex = this.indexOf(currentValue);
      operation.call(thisValue, currentValue, currentIndex, iterable);
    },arrayCopy);


    return filterItem;

};






//类型：开始


/**
 * 获取 inst 的类型
 * @param inst : any
 * @returns Type    inst 的类型
 *
 *
 *
 * 注意：
 * 本方法返回的结果如下：
 * undefined ：undefined
 * null ： null
 * 其它任何类型的实例  : 返回该实例的构造函数  或 包装对象的构造函数
 *
 */
window.getTypeOf = function (inst) {
  var typeInfo = inst;
  if (inst != null){
    typeInfo = inst.constructor;
  }

  return typeInfo;

}





/**
 * 获取 inst 的类型字符串
 * @param inst : any
 * @returns string    inst 的类型字符串
 *
 *
 *
 * 注意：
 * 本方法返回的结果如下：
 * undefined ："undefined"
 * null ： "null"
 * 其它任何类型的实例  : 返回该实例的构造函数  或 包装对象的构造函数 的函数名字
 *
 */
window.getTypeStringOf = function (inst) {

  switch (inst){
    case undefined:{
      var typeStr = "undefined";
      break;
    }

    case null:{
      typeStr = "null";
      break;
    }

    default:{
      typeStr = inst.constructor.name;
    }
  }

  return typeStr;

};



//类型：结束
