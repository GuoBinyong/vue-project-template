/*
 使用属性描述来定义属性的原因：
 - 为了不让 for...in 等类似的操作遍历这些定义在原型上的方法或属性，需要将属性设置为不可枚举的；
 - 为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；
 */


let propertyDescriptors = {


  //去重：开始


    /*
    getNoRepeats()
    获取去除重复项目后的数组

    ## 注意
    - 该方法不改原数组，会返回一个新的数组；
    - 该方法是通过 严格相等 `===` 运算符来判断 数组的元素是否重复的；
    */
    getNoRepeats: {
      enumerable: false,
      value: function () {

        return this.filter(function (currentItem, index, arr) {
          return index === arr.indexOf(currentItem);
        });

      }
    },


    /**
     getNoRepeatsUseRepeatTest(isRepeated)
     根据重复测试函数 `isRepeated` 来获取去除重复项目后的新数组

     - @param isRepeated  : (item1,item2)=> boolean      重复油测试函数，传入被测试的2个项目，返回布尔值，表示这2个项目是否是重复的；
     - @returns : Array  返回去除重复项目后的新数组

     ## 注意
     - 该方法不改原数组，会返回一个新的数组；
     - 该方法是通过 isRepeated 函数来判断 数组的元素是否重复的；
     */
    getNoRepeatsUseRepeatTest: {
      enumerable: false,
      value: function (isRepeated) {

        return this.filter(function (currentItem, index, arr) {
          return index === arr.findIndex(function (findItem) {
            return isRepeated(findItem, currentItem);
          });
        });

      }
    },


  //去重：结束









  //安全操作：开始

    /*
    JavaScript 数组中与遍历相关的方法都是非安全 和 非严谨的，当在遍历时增删原始数组的元素时，会引出问题；
    详情请参考文章：https://www.jianshu.com/p/6dd641d0c13d

    以下 安全操作 的方法便是用来解决这些问题的；
     */




    /**
     * safelyOperateIndexs(indexList, operation, thisValue)
     * 安全操作指定的索引
     * @param indexList : [Index]   需要被操作的索引数组
     * @param operation : (currentValue,currentIndex,currentArray)=>Void     执行的操作
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Item]   被操作的元素列表
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>Void
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     *
     */
    safelyOperateIndexs: {
      enumerable: false,
      value: function (indexList, operation, thisValue) {

        if (thisValue == undefined) {
          thisValue = this;
        }

        let itemList = this.filter(function (currentValue, index) {
          return indexList.includes(index);
        });


        itemList.forEach((currentValue) => {
          let currentIndex = this.indexOf(currentValue);
          operation.call(thisValue, currentValue, currentIndex, this);
        });

        return itemList;

      }

    },


    /**
     * safelyOperateItems(itemList, operation, thisValue)
     * 安全操作指定的元素
     * @param itemList : [Item]   需要被操作的元素的数组
     * @param operation : (currentValue,currentIndex,currentArray)=>Void     执行的操作
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Index]   被操作的元素的索引的列表；
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>Void
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     *
     */
    safelyOperateItems: {
      enumerable: false,
      value: function (itemList, operation, thisValue) {

        if (thisValue == undefined) {
          thisValue = this;
        }


        let itemListCopy = [];
        let indexList = itemList.map((item) => {
          itemListCopy.push(item);
          return this.indexOf(item);
        });

        itemListCopy.forEach((currentValue) => {
          let currentIndex = this.indexOf(currentValue);
          operation.call(thisValue, currentValue, currentIndex, this);
        });

        return indexList;

      }

    },





    /**
     * safelyFilter(operation, thisValue)
     * 安全地操作并过滤所有元素；与 forEach 和 filter 的区别是： safelyFilter 能保证会遍历数组中所有已存在的元素，不会受 operation 中的行为的影响；
     * @param operation : (currentValue,currentIndex,currentArray)=>boolean | undefined     执行的操作， 该函数的返回值表示是否要过滤出该元素
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Item]  返回被 operation 过滤出的元素
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>boolean | undefined
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     * @returns boolean | undefined  表示是否要过滤出 currentValue ；
     *
     */
    safelyFilter: {
      enumerable: false,
      value: function (operation, thisValue) {

        if (thisValue == undefined) {
          thisValue = this;
        }

        let arrayCopy = this.slice();
        let filterItem = arrayCopy.filter((currentValue) => {
          let currentIndex = this.indexOf(currentValue);
          operation.call(thisValue, currentValue, currentIndex, this);
        });


        return filterItem;

      }

    },


  //安全操作：结束











  //移动元素：开始


    /**
     * move(fromIndex, toIndex, length = 1)
     * 根据索引移动数组的元素
     * @param fromIndex : number   被移动的元素的开始索引
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param length ? : number   可选，默认值：1 ； 被移动的元素的长度；
     * @returns Array   被移动的元素的数组
     */
    move: {
      enumerable: false,
      value: function (fromIndex, toIndex, length = 1) {
        let moveEleArr = this.splice(fromIndex, length);
        this.splice(toIndex, 0, ...moveEleArr);

        return moveEleArr;
      }

    },


    /**
     * moveTo(toIndex, ...fromIndexs)
     * 根据索引批量移动数组的元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param fromIndex : number   被移动的元素的索引
     * @returns Array<Item>   被移动的元素的数组
     */
    moveTo: {
      enumerable: false,
      value: function (toIndex, ...fromIndexs) {

        let moveItems = this.deleteIndexs(...fromIndexs);
        this.splice(toIndex, 0, ...moveItems);

        return moveItems;
      }

    },


    /**
     * moveItemsTo(toIndex, ...items)
     * 批量移动数组的指定元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param item : any   被移动的元素
     * @returns Array<number>   被移动的元素的索引的数组
     */
    moveItemsTo: {
      enumerable: false,
      value: function (toIndex, ...items) {

        let indexArr = this.deleteItems(...items);
        this.splice(toIndex, 0, ...items);
        return indexArr;
      }

    },


    /**
     * moveToUseTest(toIndex, needMoveTest)
     * 根据测试函数批量移动数组的元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param needMoveTest : (currentValue,index,arr)=>boolean    测试数组元素是否需要被移动的函数，返回 boolean 值，表示当前元素 currentValue 是否需要被移动；
     * @returns Array<Item>   被移动的元素的数组
     */
    moveToUseTest: {
      enumerable: false,
      value: function (toIndex, needMoveTest) {

        let moveItems = this.deleteUseTest(needMoveTest);
        this.splice(toIndex, 0, ...moveItems);

        return moveItems;
      }

    },


  //移动元素：结束










  //插入元素：开始


    /**
     * insertItem(item, toIndex = 0, equalTest)
     * 将指定元素插入到调用者数组中指定索引处，并且会删除调用者数组中与 item 相同的元素
     * @param item : any    被插入的元素
     * @param toIndex : number    元素被插入到的位置的索引
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array<Item>   被删除的元素
     */
    insertItem: {
      enumerable: false,
      value: function (item, toIndex = 0, equalTest) {

        if (!equalTest) {
          equalTest = function (a, b) {
            return a === b;
          };
        }


        let deleItems = this.filter((currentValue, currentIndex, arr) => {
          return equalTest.call(this, currentValue, item);
        });


        this.deleteItems(...deleItems);
        this.splice(toIndex, 0, item);

        return deleItems;

      }

    },


    /**
     * insertItemList(itemList, toIndex, equalTest)
     * 将指定数组itemList中的元素插入到调用者数组的指定索引处，并且会删除调用者数组中 与 itemList中元素 相同的元素
     * @param itemList : [any]    被插入的元素数组
     * @param toIndex : number    元素被插入到的位置的索引
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array<Item>   被删除的元素
     */
    insertItemList: {
      enumerable: false,
      value: function (itemList, toIndex, equalTest) {
        return itemList.reduceRight((deleItemList, item) => {
          let deleItems = this.insertItem(item, toIndex, equalTest);
          deleItemList.unshift(...deleItems);
          return deleItemList;
        }, []);
      }

    },

  //插入元素：结束









  //删除元素：开始

    /**
     * delete(start, end)
     * 根据索引删除数组的元素
     * @param start : number   被删除的元素的开始索引
     * @param end ? : number   可选，默认值：start ； 被删除的元素的结束索引；
     * @returns Array   被删除的元素的数组
     */
    delete: {
      enumerable: false,
      value: function (start, end) {
        if (end == null) {
          end = start;
        }
        let length = end + 1 - start;
        return this.splice(start, length);
      }

    },


    /**
     * deleteIndexs(...indexs)
     * 删除数组中指定的元素
     * @param item : any   被删除的元素
     * @returns Array<Item>   被删除的元素的数组
     */
    deleteIndexs: {
      enumerable: false,
      value: function (...indexs) {

        return this.safelyOperateIndexs(indexs, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);

      }

    },


    /**
     * deleteItems(...items)
     * 删除数组中指定的元素
     * @param item : any   被删除的元素
     * @returns Array<number>   被删除的元素的索引数组
     */
    deleteItems: {
      enumerable: false,
      value: function (...items) {

        return this.safelyOperateItems(items, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);

      }

    },


    /**
     * deleteUseTest(needDeleteTest)
     * 根据测试函数批量删除数组的元素
     * @param needDeleteTest : (currentValue,index,arr)=>boolean    测试数组元素是否需要被删除的函数，返回 boolean 值，表示当前元素 currentValue 是否需要被删除；
     * @returns Array<Item>   被删除的元素的数组
     */
    deleteUseTest: {
      enumerable: false,
      value: function (needDeleteTest) {

        let itemList = this.filter((currentValue, currentIndex, arr) => {
          return needDeleteTest.call(this, currentValue, currentIndex, arr);
        });


        this.safelyOperateItems(itemList, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);


        return itemList;
      }

    },


  //删除元素：结束






  //查找元素：开始

    /**
     * filterIndexs(filterTest,thisArg)
     * 该方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素的索引。
     * @param filterTest : (currentValue,index,arr)=>boolean    用来测试数组的每个元素的函数。调用时使用参数 (currentValue,index,arr)。返回true表示保留该元素（通过测试），false则不保留
     * @param thisArg ? : any 可选。执行 callback 时的用于 this 的值。
     * @returns Array<Index>   通过测试的元素的索引
     */
    filterIndexs: {
      enumerable: false,
      value: function (filterTest,thisArg) {

        if  (thisArg == undefined){
          thisArg = this;
        }

        return this.reduce(function(indexList, currentValue, index,arr){
          if (filterTest.call(thisArg,currentValue,index,arr)) {
            indexList.push(index);
          }
          return indexList;
        },[]);

      }

    },


    /**
     * 属性; 返回最后一个元素
     */
    lastItem: {
      enumerable: false,
      get: function () {
        return this[this.length - 1];
      }
    },
  //查找元素：结束



  //集合运算：开始

    /**
     * isContains(arr,equalTest)
     * 判断当前数组 是否包含 数组arr 的所有元素；
     * @param arr : Array   被测试的数组
     * @param equalTest ? : (thisEle,arrEle)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素thisEle 和 元素arrEle  相同；
     * @returns boolean
     */
    isContains: {
      enumerable: false,
      value: function (arr,equalTest) {

        if (!equalTest) {
          equalTest = function (a, b) {
            return a === b;
          };
        }

        return arr.every(function(item){

          return this.some(function(thisItem){
            return equalTest.call(this, thisItem, item);
          },this);

        }, this);

      }
    },



    /**
     * getIntersection(arr,equalTest)
     * 获取指定数组的交集
     * @param arr  : Array   数组
     * @param equalTest ? : (thisEle,arrEle)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素thisEle 和 元素arrEle  相同；
     * @returns Array   所有指定数组的交集
     */
    getIntersection: {
      enumerable: false,
      value: function (arr,equalTest) {

        if (!equalTest){
          equalTest = function (a, b) {
            return a === b;
          };
        }

        return this.filter(function(thisEle){
         return arr.some(function(arrEle){
            return equalTest(thisEle,arrEle);
          });
        });

      }
    },



    /**
     * isIntersect(arr,equalTest)
     * 判断当前数组与指定数组是否相交
     * @param arr ? : Array   数组
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns boolean   当前数组与指定数组是否相交
     */
    isIntersect: {
      enumerable: false,
      value: function (arr,equalTest) {

        if (!equalTest){
          equalTest = function (a, b) {
            return a === b;
          };
        }

        return this.some(function(thisEle){
          return arr.some(function(arrEle){
            return equalTest(thisEle,arrEle);
          });
        });

      }
    },





    /**
     * 获取当前数组在指定数组上的补集
     * @param universalArr ? : Array   全集数组
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array   当前数组在指定数组上的补集
     */
    getComplementOn: {
      enumerable: false,
      value: function (universalArr,equalTest) {
        if (!equalTest) {
          equalTest = function (a, b) {
            return a === b;
          };
        }



        let result =  universalArr.filter(function(item){

          return !this.some(function(arrItem){
            return equalTest.call(this,item,arrItem);
          },this);

        },this);


        return result;
      }
    },




  /**
   * 获取符合 包含 和 排除 项 的所有元素
   * getIncludeAndExclude(options,equalTest)
   * @param options : {include ?: Array,exclude ?: Array}    必须；配置 包含 和 排除 数组 的 选项；
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @returns Array   当前数组在指定数组上的补集
   */
  getIncludeAndExclude: {
    enumerable: false,
    value: function (options,equalTest) {
      var {include,exclude} = options;
      var valids = this;
      if (include){
        valids = valids.getIntersection(include,equalTest);
      }

      if (exclude){
        valids = exclude.getComplementOn(valids,equalTest);
      }

      return valids;
    }
  },


  //集合运算：结束


  //处理索引：开始

    /**
     * 获取指定索引的反相索引，即从后往前的索引，从0开始
     * @param index : number   正向的索引
     */
    reverseIndexForIndex: {
      enumerable: false,
      value: function (index) {
        return this.length - index - 1;
      }
    },

    //处理索引：开始







    //遍历优化：开始




    /**
     * multipleLoop(option)=> stopLoop()
     * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
     * @param option : {loopCall,complete,stepComplete,thisValue,step,delay}   选项对象
     * @property option.loopCall : (currentValue,index,stepCount,arr)=>stopInfo : any  必选；每次循环的回调函数；入参 currentValue : Item  当前index对应数组元素； 入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr:Array 当前被循环的数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
     * @property option.stepComplete ？ : (index,stepCount,arr)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
     * @property option.complete ？: (stopInfo,index,stepCount,arr)=>Void  可选；循环结束时的回调函数；入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组；
     * @property option.thisValue ? : any   可选；默认值：当前数组； loopCall、complete、stepComplete  回调函数的this的值；
     * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
     * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
     * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
     */
    multipleLoop: {
      enumerable: false,
      value: function ({loopCall,complete,stepComplete,thisValue,step,delay}) {

        if (thisValue){
          thisValue = this;
        }

        let loopOpt = {
          loopCall:(index,stepCount,total)=> {
            return loopCall.call(thisValue,this[index],index,stepCount,this);
          },
          total:this.length,
          step:step,
          delay:delay
        };

        if (complete){
          loopOpt.complete = (stopInfo,index,stepCount,total)=>{
            return complete.call(thisValue,stopInfo,index,stepCount,this);
          };
        }

        if (stepComplete){
          loopOpt.stepComplete = (index,stepCount,total)=>{
            return stepComplete.call(thisValue,index,stepCount,this);
          };
        }


        return multipleLoop(loopOpt);
      }
    },

    //遍历优化：结束




  //队列：开始

    /**
     * queuePush(item1, item2, ..., itemX)
     * 从队列尾部推入所有的item；此操作会从数组开始删除相应的数目的元素
     * @param item : any    推入队列的元素
     * @returns Array    返回包含所有删除元素的数组
     */
    queuePush: {
      enumerable: false,
      value: function (...items) {
        this.push(...items);
        return this.splice(0,items.length);
      }
    },



    /**
     * queuePop()
     * 从队列尾部推出（删除）一个item；此操作会将数组剩下的元素往数组尾部移动一位；
     * @returns any    返回被删除的元素
     */
    queuePop: {
      enumerable: false,
      value: function () {
        this.unshift(undefined);
        return this.pop();
      }
    },




    /**
     * queueUnshift(item1, item2, ..., itemX)
     * 从队列头部推入所有的item；此操作会从数组尾部删除相应的数目的元素
     * @param item : any    推入队列的元素
     * @returns Array    返回包含所有删除元素的数组
     */
    queueUnshift: {
      enumerable: false,
      value: function (...items) {
        this.unshift(...items);
        let len = items.length;
        return this.splice(-len,len);
      }
    },




    /**
     * queueShift()
     * 从队列头部推出（删除）一个item；此操作会将数组剩下的元素往数组头部移动一位；
     * @returns any    返回被删除的元素
     */
    queueShift: {
      enumerable: false,
      value: function () {
        this.push(undefined);
        return this.shift();
      }
    },

  //队列：结果




  };


  Object.defineProperties(Array.prototype, propertyDescriptors);






  //集合运算：开始

  /**
   * 获取所有指定数组的交集
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @param array ? : Array   数组
   * @returns Array   所有指定数组的交集
   */
  Array.intersectionOf = function intersectionOf(equalTest,...arrays) {

    if (typeof equalTest != "function"){

      if (Array.isArray(equalTest)) {
        arrays.unshift(equalTest);
      }

      equalTest = function (a, b) {
        return a === b;
      };

    }



    arrays.sort(function(arr1,arr2){
      return arr1.length - arr2.length ;
    });

    let leastArr = arrays.shift();


    let result =  leastArr.filter(function(item){

      return arrays.every(function(arr){

        return arr.some(function(arrItem){
          return equalTest(item,arrItem);
        });

      });

    });


    return result;
  }






  /**
   * 判断所有指定数组是否有交集
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @param array ? : Array   数组
   * @returns boolean   所有指定数组是否有交集
   */
  Array.isIntersect = function isIntersect(equalTest,...arrays) {

    if (typeof equalTest != "function"){

      if (Array.isArray(equalTest)) {
        arrays.unshift(equalTest);
      }

      equalTest = function (a, b) {
        return a === b;
      };

    }



    arrays.sort(function(arr1,arr2){
      return arr1.length - arr2.length ;
    });

    let leastArr = arrays.shift();


    let result =  leastArr.some(function(item){

      return arrays.every(function(arr){

        return arr.some(function(arrItem){
          return equalTest(item,arrItem);
        });

      });

    });


    return result;
  };





  //集合运算：结束










  /**
   * isArrayLike(target)
   * 判断 target 是否为 类数组对象
   * @param target : any    目标
   * @returns boolean
   */
  Array.isArrayLike = function isArrayLike(target) {
    let length = target && target.length;
    return Number.isInteger(target.length) && length >= 0;
  }
