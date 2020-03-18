/**
 * 导航类型标识符常量
 */
const navTypeMap = {
  back: "back",    // 后退
  forward: "forward",   // 前进
  push: "push",    // 推入
  replace: "replace",   // 替换
  load: "load",  //加载
  unknown:"unknown"  //未知
};







//配置属性：开始

let propertyDescriptors = {

  /**
   * navList : Array<NavObject>   导航栈
   *
   * NavObject = {url:string ,state:any,title:string,name:string}     导航对象
   *
   * navObject.url : string   本次导航的url位置
   * navObject.state ? : any   描述本次导航的state
   * navObject.title ? : string   描述本次导航的设置的title，与民pushState 和 replaceState 方法中的 title 相同
   * navObject.name ? : string   本次导航的名字
   */
  navList:{
    enumerable:false,
    get:function(){
      if (!this._navList) {
        let _navList = sessionStorage.getParsedItem("history.navList");
        if (!Array.isArray(_navList)) {
          _navList = [{
            url: location.href,
            state:this.state
          }];
        }

        this._navList = _navList;
      }
      return this._navList;
    }
  },


  /**
   * maxNavIndex : number   当前最大的导航索引 navIndex
   */
  maxNavIndex:{
    enumerable:false,
    get:function(){
      return this.navList.length - 1;
    }
  },


  /**
   * currNavIndex : number    当前的慎用索引 ；
   */
  currNavIndex:{
    enumerable:false,
    get:function(){
      if (this._currNavIndex == undefined) {
        let _currNavIndex = sessionStorage.getParsedItem("history.currNavIndex");
        this._currNavIndex = typeof _currNavIndex == "number" ? _currNavIndex : 0;
      }
      return this._currNavIndex;
    },

    set:function (newValue) {
      this.oldNavIndex = this.currNavIndex;
      this._currNavIndex = newValue;
      sessionStorage.setAnyItem("history.currNavIndex",newValue);
    }
  },




  /**
   * navType : string  navType的成员； 当前页面的导航类型，即：页面是怎么到这的；
   * 当 给 navType 设置为 null 时，将自动根据 currNavIndex 和 oldNavIndex 来计算，
   */
  navType:{
    enumerable:false,
    get:function(){
      if  (this._navType != undefined){
        return this._navType ;
      }



      let currNavIndex = this.currNavIndex;
      let oldNavIndex = this.oldNavIndex;

      //解释：如果 oldNavIndex 不存在，则 currNavIndex  与 oldNavIndex 的比较总是返回 false
      if (oldNavIndex == undefined) {
        return navTypeMap.load;
      }else if (currNavIndex > oldNavIndex) {
        return navTypeMap.forward;
      }else if (currNavIndex < oldNavIndex){
        return navTypeMap.back;
      }else {
        return navTypeMap.replace;
      }



    },

    set:function (newValue) {
      this._navType = newValue;
    }

  },


  /**
   * oldLength : number   表示上一次 length 的长度
   */
  oldLength:{
    enumerable:false,
    get:function(){
      if  (this._oldLength == undefined){
        let _oldLength = sessionStorage.getParsedItem("history.oldLength");
        this._oldLength = typeof _oldLength == "number" ? _oldLength : 0;
      }

      return this._oldLength;
    },

    set:function (newValue) {
      this._navType = newValue;
      sessionStorage.setAnyItem("history.oldLength",newValue);
    }

  },



  /**
   * navInfo : {type : string,index : number,url : string,state ? : any,title ? : string,name ? : string,arguments ? : Arguments || Array}      获取导航信息
   *
   * navInfo.type : string   描述本次导航的类型， 该属性可能的值由 navTypeMap 常量定义
   * navInfo.index : number   本次导航位置在navList中的索引
   * navInfo.url : string   本次导航的url位置
   * navInfo.state ? : any   描述本次导航的state
   * navInfo.title ? : string   描述本次导航的设置的title，与民pushState 和 replaceState 方法中的 title 相同
   * navInfo.name ? : string   本次导航的名字
   * navInfo.arguments ? : Arguments || Array   描述本次导航的参数
   */
  navInfo:{
    enumerable:false,
    get: function () {
      if (!this._navInfo) {
        let currNavIndex = this.currNavIndex;
        let currNav = this.navList[currNavIndex];

        let _navInfo = {
          type:this.navType,
          index:currNavIndex,
          ...currNav
        };

        let navArguments = this.navArguments;
        if  (this.navArguments){
          _navInfo.arguments = this.navArguments;
        }


        this._navInfo = _navInfo;
      }
      return this._navInfo;
    },

    set: function (newValue) {
      this._navInfo = newValue;
    }

  },




  /**
   * popstate事件的监听器
   */
  _popstateEventListener:{
    get:function(){
      
      var _this = getThisOfHistory(this);
      if (!_this._popstateEventListener_){

        _this._popstateEventListener_ = function(event) {
          let navList = _this.navList ;
        
          let nav = {url:location.href};
        
          let state = event.state;
          if (state != undefined) {
            nav.state = state ;
          }
        
          _this._parseNavOfGo(nav);
        };

      }

      return _this._popstateEventListener_;
    }
  },


};




Object.defineProperties(History.prototype,propertyDescriptors);


//配置属性：结束



/**
 * 获取 this 值，本方法确定获取的this值一定是 History 的实例
 * @param History 
 */
function getThisOfHistory(thisValue){
  return thisValue instanceof History ? thisValue : history ;
}




//替换原来的方法：开始


/**
 *创建 back 函数
 * @author 郭斌勇
 */
function createBack(oriBack){
  return function back() {
    var _this = getThisOfHistory(this);
    _this.navArguments = [-1];
    oriBack.apply(_this,arguments);
  };
}



/**
 *创建 forward 函数
 * @author 郭斌勇
 */
function createForward(oriForward){
  var _this = getThisOfHistory(this);
  return function forward() {
    _this.navArguments = [1];
    oriForward.apply(_this,arguments);
  };
}


/**
 *创建 go 函数
 * @author 郭斌勇
 */
function createGo(oriGo){
  var _this = getThisOfHistory(this);
  return function go() {
    _this.navArguments = arguments;
    oriGo.apply(_this,arguments);
  };
}



/**
 *创建 pushState 函数
 * @author 郭斌勇
 */
function createPushState(oriPushState){
  return function pushState(state,title,url) {
    var _this = getThisOfHistory(this);
    if (!_this._navIsInited){
      _this.initNav;
    }

    _this.oldLength = _this.length;
    _this.navArguments = arguments;
  
    oriPushState.apply(_this,arguments);
    _this._parseNavOfPush({state:arguments[0],title:arguments[1],url:arguments[2]});
  };
}


/**
 *创建 replaceState 函数
 * @author 郭斌勇
 */
function createReplaceState(oriReplaceState){
  return function replaceState(state,title,url) {
    var _this = getThisOfHistory(this);
    if (!_this._navIsInited){
      _this.initNav;
    }
    _this.navArguments = arguments;
    oriReplaceState.apply(_this,arguments);
    _this._parseNavOfReplace({state:arguments[0],title:arguments[1],url:arguments[2]});
  };
}


/**
 *替换 History 实例的原生方法，会替换以下方法：back、、forward、go、pushState、replaceState
 * 
 * @author 郭斌勇
 * @param {History} historyInst
 */
function replaceNativeMethodOf(historyInst) {

  let { back: oriBack, forward: oriForward, go: oriGo, pushState: oriPushState, replaceState: oriReplaceState } = historyInst;


  let repOriMethodProperties = {
    back: {
      get: function () {
        var _this = getThisOfHistory(this);
        if (!_this._back) {
          _this._back = createBack(oriBack);
        }

        return _this._back;
      },
      set: function (oriBack) {
        var _this = getThisOfHistory(this);
        _this._back = createBack(oriBack);
      }
    },



    forward: {
      get: function () {
        var _this = getThisOfHistory(this);
        if (!_this._forward) {
          _this._forward = createForward(oriForward);
        }

        return _this._forward;
      },
      set: function (oriForward) {
        var _this = getThisOfHistory(this);
        _this._forward = createForward(oriForward);
      }
    },






    go: {
      get: function () {
        var _this = getThisOfHistory(this);
        if (!_this._go) {
          _this._go = createGo(oriGo);
        }

        return _this._go;
      },
      set: function (oriGo) {
        var _this = getThisOfHistory(this);
        _this._go = createGo(oriGo);
      }
    },





    pushState: {
      get: function () {
        var _this = getThisOfHistory(this);
        if (!_this._pushState) {
          _this._pushState = createPushState(oriPushState);
        }

        return _this._pushState;
      },
      set: function (oriPushState) {
        var _this = getThisOfHistory(this);
        _this._pushState = createPushState(oriPushState);
      }
    },





    replaceState: {
      get: function () {
        var _this = getThisOfHistory(this);
        if (!_this._replaceState) {
          _this._replaceState = createReplaceState(oriReplaceState);
        }

        return _this._replaceState;
      },
      set: function (oriReplaceState) {
        var _this = getThisOfHistory(this);
        _this._replaceState = createReplaceState(oriReplaceState);
      }
    },



  };

  Object.defineProperties(historyInst, repOriMethodProperties);

}


/**
 * 为了防止 webview 外壳（加过webview的应用程序，如：打开生活号的支付宝、打开公众号的微信、包壳的应用app等）对 webview 中的 history 实例的改造影响到 本工具实现的 导航工能
 * 需要 单独对 webview 默认创建的 History 实例 history 单独进行下方式替换；
 * 
 * 又因为在进行方法替换时，会选获取替换对象的原方法
 * 所以，如果 先对 History.prototype 进行替换，则，当再对 history 进行替换时，在获取原方法时 有可能会获取到 History.prototype 中已被替换后的方法，这就会使得 webview 外壳 对 history 改变的 方法丢失；
 * 所以，需要 先对 history 方法进行替换，然后再对 History.prototype 方法进行替换；
 */

replaceNativeMethodOf(history);
replaceNativeMethodOf(History.prototype);


//替换原来的方法：开始





//解析导航：开始


/**
 * 解析go的导航
 * @param nav : Nav     新的导航对象
 *
 * 注意：
 * 在navList中的导航元素小于2时（一般发生在初始时，比如重新加载了页面），用前进后退按钮是无法判断方向的，此时默认用返回的处理逻辑；但如果监测到 history.length 发生变化，便可判断之前的移动方法；而 history.length 只会发生在 pushState 和 replaceState 时
 */
History.prototype._parseNavOfGo = function _parseNavOfGo(nav){

  let navArguments = this.navArguments;
  let stepNumber = navArguments && navArguments[0];

  if (typeof stepNumber == "number") {
    this._parseNavOfGoWithStepNumber(nav,stepNumber);
  }else {
    this._parseNavOfGoWithout(nav);
  }

  this._configNavData();
};



/**
 * 用 跳转的步数 stepNum 来校验、纠正、配置当前 navList
 * @param stepNum : number   跳转的步数
 */
History.prototype._parseNavOfGoWithStepNumber = function _parseNavOfGoWithStepNumber(nav,stepNum){

  let isBack = stepNum < 0 ;
  let currIndex = this.currNavIndex;
  let matchIndexs = this.matchedIndexs(nav);  //匹配的index
  let expIndex = currIndex + stepNum ; //预期的 index
  let expIsValid = matchIndexs.includes(expIndex) ; //expIndex 是否有效



  if (this.navType == navTypeMap.unknown && matchIndexs.length > 0) {  //校验 navList
    let needReverse = false ;  //navList 是否需要反转

    if (!expIsValid) { //如果没有找到匹配的，改变方向再次查找
      expIndex = currIndex - stepNum;
      expIsValid = matchIndexs.includes(expIndex);
      needReverse = expIsValid ;

      if (!expIsValid) {  //如果没有找到匹配的，就根据 nav 找出 navList 中最匹配的（某方向上最接进 stepNum 步数的）

        let backMatcheds = [];   //返回方向上匹配的 index
        let forwardMatcheds = [];   //前进方向上匹配的 index
        matchIndexs.forEach(function (matched) {

          if (Math.abs(matched - currIndex) <= Math.abs(stepNum)){
            if (matched < currIndex) {
              backMatcheds.push(matched);
            }else {
              forwardMatcheds.push(matched);
            }
          }

        });



        let backHave = backMatcheds.length > 0 ;
        let forwardHave = forwardMatcheds.length > 0 ;


        if (backHave || forwardHave) {

          if  (isBack){

            if (backHave) {
              expIndex = Math.min(...backMatcheds);
              expIsValid = true;
            }else {
              expIndex = Math.max(...backMatcheds);
              expIsValid = true;
              needReverse = true;
            }

          }else {

            if (forwardHave) {
              expIndex = Math.max(...backMatcheds);
              expIsValid = true;
            }else {
              expIndex = Math.min(...backMatcheds);
              expIsValid = true;
              needReverse = true;
            }

          }

        }




      }

    }






    //纠正navList
    if (needReverse) {
      expIndex = this.navList.reverseIndexForIndex(expIndex);
      this.navListReverse();
    }




  }else {

    let validStepNum = this.getValidGoStepNumber(stepNum);
    expIndex = currIndex + validStepNum ;
    expIsValid = true;

  }










  //根据 expIndex 更新 navList
  if (expIndex < 0) {
    let overNavs = new Array(Math.abs(expIndex));
    overNavs[0] = nav ;
    this.navListUnshift(...overNavs);
  }else if (expIndex > this.maxNavIndex) {

    let overNum = expIndex - this.navList.length ;
    let overNavs = new Array(overNum);
    overNavs.push(nav);
    this.navListPush(...overNavs);

  }else {
    this.navListSetNav(expIndex,nav);
  }



};


/**
 * 在没有参考数据的情况下激活 nav
 * 注意：
 * 在navList中的导航元素少于2个时（一般发生在初始时，比如重新加载了页面），用前进后退按钮是无法判断方向的，此时默认用返回的处理逻辑；
 */
History.prototype._parseNavOfGoWithout = function _parseNavOfGoWithout(nav){

  let currIndex = this.currNavIndex;
  let navList = this.navList ;

  /*
  在navList中的导航元素少于2个时（一般发生在初始时，比如重新加载了页面），用前进后退按钮是无法判断方向的，此时默认用返回的处理逻辑；
   */
  if (navList.length < 2) {
    this.navListUnshift(nav); //以返回的逻辑添加 nav
    this.navType = navTypeMap.unknown;  //设置 navType 为 unknown
    return;
  }



  /*
  * 当 navList 中的元素大于或等于2个时，查找navList中与nav最近的匹配项
  * */

  let navIndex = this.nearestNavIndex(function (navItem,index,arr) {
    return nav.isSubsetOf(navItem,function(a,b){
      return isEqualOfJSON(a,b);
    });
  });



  if (navIndex == undefined) {  //当未在当前 navList 查找到 nav 时

    let nearestIndex = currIndex.nearest(0,this.maxNavIndex);

    if  (nearestIndex === 0){ // 如果当前的索引离0最近，就以返回的逻辑添加 nav
      this.navListUnshift(nav);
    }else { // 如果当前的索引离 maxNavIndex 最近，就以前进的逻辑添加 nav
      this.navListPush(nav);
    }


  }else {
    this.activateNavIndex(navIndex);
  }


};






/**
 * 解析push导航
 * @param nav : Nav  导航位置
 */
History.prototype._parseNavOfPush = function _parseNavOfPush(nav){

  if (this.length > this.oldLength && this.navList.length > 1 && this.currNavIndex == 0 ){
    this.navListReverse();
  }

  let navIndex = this.currNavIndex + 1;
  let navList = this.navList;
  navList.splice(navIndex);
  navList.push(nav);
  this.currNavIndex = navList.length - 1;
  this.navType = navTypeMap.push;
  this._configNavData();
};


/**
 * 将当前的位置替换为 指定的 nav
 * @param nav : Nav  导航位置
 */
History.prototype._parseNavOfReplace = function _parseNavOfReplace(nav){
  this.navListSetNav(this.currNavIndex,nav);
  this.navType = navTypeMap.replace;
  this._configNavData();
};






/**
 * 配置相关数据:navInfo、存储navList、清空临时数据
 */
History.prototype._configNavData = function _configNavData(){

  //配置navInfo

  let currNavIndex = this.currNavIndex;
  let navList = this.navList;
  let currNav = navList[currNavIndex];

  let navInfo = {
    type:this.navType,
    index:currNavIndex,
    ...currNav
  };

  let navArguments = this.navArguments;
  if  (navArguments){
    navInfo.arguments = this.navArguments;
  }

  this.navInfo = navInfo;


  //储存数据
  sessionStorage.setAnyItem("history.navList",navList);

  //清除临时数据
  this.navArguments = null;
};



//解析导航：结束





//工具方法：开始

/**
 * 根据 isSubsetOf 和 isEqualOfJSON 来查找 navList 中所有匹配 nav 的索引
 * @param nav : Nav  导航对象
 * @returns [Index]   所有匹配的索引
 */
History.prototype.matchedIndexs = function matchedIndexs(nav){

  return this.navList.filterIndexs(function (navItem) {
    return nav.isSubsetOf(navItem,function(a,b){
      return isEqualOfJSON(a,b);
    });
  },this);

};







/**
 * 把根据 filterTest 过滤出的导航索引 按照距离目标从近到远的顺序排序，并返回
 * @param filterTest : (currentValue,index,arr)=>boolean    用来测试数组的每个元素的函数。调用时使用参数 (currentValue,index,arr)。返回true表示保留该元素（通过测试），false则不保留
 * @param targetIndex ? : number   可选；默认值：当前的索引 ；
 * @returns [Index]    返回按照距离 targetIndex 从近到远排序后的索引数组
 */
History.prototype.navIndexDistanceSort = function navIndexDistanceSort(filterTest,targetIndex){

  if (targetIndex == undefined){
    targetIndex = this.currNavIndex;
  }
  let indexList = this.navList.filterIndexs(filterTest,this);
  return Math.distanceSort(targetIndex,indexList);
}



/**
 * 找出过滤出的距离 targetIndex 最近的导航的索引；
 * @param filterTest : (currentValue,index,arr)=>boolean    用来测试数组的每个元素的函数。调用时使用参数 (currentValue,index,arr)。返回true表示保留该元素（通过测试），false则不保留
 * @param targetIndex ? : number   可选；默认值：当前的索引 ；
 * @returns Index    返回过滤出的距离 targetIndex 最近的导航的索引；
 */
History.prototype.nearestNavIndex = function nearestNavIndex(filterTest,targetIndex){
  let disSortIndexs = this.navIndexDistanceSort(filterTest,targetIndex);
  return disSortIndexs[0];
}



/**
 * 找出过滤出的距离 targetIndex 最远的导航的索引；
 * @param filterTest : (currentValue,index,arr)=>boolean    用来测试数组的每个元素的函数。调用时使用参数 (currentValue,index,arr)。返回true表示保留该元素（通过测试），false则不保留
 * @param targetIndex ? : number   可选；默认值：当前的索引 ；
 * @returns Index    返回过滤出的距离 targetIndex 最远的导航的索引；
 */
History.prototype.farthestNavIndex = function farthestNavIndex(filterTest,targetIndex){
  let disSortIndexs = this.navIndexDistanceSort(filterTest,targetIndex);
  return disSortIndexs.lastItem;
}


/**
 * 往 navList 的头部追加nav
 * @param nav : Nav
 */
History.prototype.navListUnshift = function navListUnshift(...navs){
  this.navList.unshift(...navs);
  this.currNavIndex = 0;  //重置当前索引值
  this.oldNavIndex += navs.length;  //修正旧的索引值

  if (this.navType != navTypeMap.unknown) {
    this.navType = null;  //将 navType 重置为自动模式
  }

};


/**
 * 往 navList 的尾部追加nav
 * @param nav : Nav
 */
History.prototype.navListPush = function navListPush(...navs){
  this.navList.push(...navs);
  this.currNavIndex = this.maxNavIndex;  //重置当前索引值

  /**
   * 如果当前为 unknown ，则不能自动计算出 navType 所以不能将 navType 设置为 自动模式
   */
  if (this.navType != navTypeMap.unknown) {
    this.navType = null;  //将 navType 重置为自动模式
  }

};


/**
 * 给 navList 指定的 索引处设置 新的 nav 对象
 * @param index
 * @param nav
 */
History.prototype.navListSetNav = function navListSetNav(index,nav){
  this.navList[index] = nav;
  this.currNavIndex = index;

  /**
   * 如果当前为 unknown ，则不能自动计算出 navType 所以不能将 navType 设置为 自动模式
   */
  if (this.navType != navTypeMap.unknown) {
    this.navType = null;  //将 navType 重置为自动模式
  }
};





/**
 * 给 navList 指定的 索引处设置 新的 nav 对象
 * @param index
 * @param nav
 */
History.prototype.activateNavIndex = function activateNavIndex(index){
  this.currNavIndex = index;

  /**
   * 如果当前为 unknown ，则不能自动计算出 navType 所以不能将 navType 设置为 自动模式
   */
  if (this.navType != navTypeMap.unknown) {
    this.navType = null;  //将 navType 重置为自动模式
  }
};



/**
 * 反转 navList
 */
History.prototype.navListReverse = function navListReverse(){
  let navList = this.navList;
  navList.reverse();
  let currNavIndex = navList.reverseIndexForIndex(this.currNavIndex);
  let oldNavIndex = navList.reverseIndexForIndex(this.oldNavIndex);
  this.currNavIndex = currNavIndex;
  this.oldNavIndex = oldNavIndex;
};


/**
 * 获取可前进 或者 后退的最大步数
 * @param back ? : boolean    可选；默认值：false ; 后退 ；
 */
History.prototype.maxGoStepNumber = function maxGoStepNumber(back) {

  let length = this.length;
  let currNavIndex = this.currNavIndex;


  if (back){
    return length - this.navList.length + currNavIndex;
  }

  return length - currNavIndex - 1;
};



/**
 * 判断前进 或者 后退的步数是否是无效的
 * @param back ? : boolean    可选；默认值：false ; 后退 ；
 */
History.prototype.isInvalidForGoStepNumber = function isInvalidForGoStepNumber(stepNumber) {
  let maxStep = this.maxGoStepNumber(stepNumber < 0);
  return Math.abs(stepNumber) > maxStep;
};





/**
 * 获取前进 或者 后退的有效步数
 * @param back ? : boolean    可选；默认值：false ; 后退 ；
 */
History.prototype.getValidGoStepNumber = function getValidGoStepNumber(stepNumber) {
  let maxStep = this.maxGoStepNumber(stepNumber < 0);

  if (stepNumber < 0) {
    return Math.max(stepNumber,-maxStep);
  }

  return stepNumber < 0 ? Math.max(stepNumber,-maxStep) : Math.min(stepNumber,maxStep);
};



//工具方法：结束









//监听事件：开始



/**
 * 监听 popstate
 */
History.prototype._listenPopstate = function(){
  var _this = getThisOfHistory(this);
  window.addEventListener("popstate",_this._popstateEventListener);
}

/**
 * 移除当前 history 监听 popstate 事件的监听器
 */
History.prototype._removePopstateListener = function(){
  var _this = getThisOfHistory(this);
  window.removeEventListener("popstate",_this._popstateEventListener);
}




//监听事件：结束




// 初始化和销毁：开始

/**
 * 初始化导航
 */
History.prototype.initNav = function(){
  var _this = getThisOfHistory(this);

  if (_this._navIsInited){
    return;
  }

  _this._navIsInited = true;
  _this._listenPopstate();
}

/**
 * 销毁导航
 */
History.prototype.destroyNav = function(){
  var _this = getThisOfHistory(this);
  _this._navIsInited = false;
  _this._removePopstateListener();
}



// 初始化和销毁：结束





// history初始化：开始
history.initNav();
// history初始化：结束