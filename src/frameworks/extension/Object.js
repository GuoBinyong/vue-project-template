/*
 使用属性描述来定义属性的原因：
 - 为了不让 for...in 等类似的操作遍历这些定义在原型上的方法或属性，需要将属性设置为不可枚举的；
 - 为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；


 注意：
 - Object.prototype 和  Object 上不能定义同名成员；
 */



let propertyDescriptors = {


  /**
   * 找出对象中符合测试函数的属性名
   * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
   */
  findKey: {
    enumerable: false,
    value: function (testFun) {

      let propKey = Object.keys(this).find((key, index) => {
        let propValue = this[key];
        return testFun(propValue, key, index);
      });

      return propKey;
    }
  },


  /**
   * 找出对象中符合测试函数的属性信息
   * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
   * @return PropertyInfo : {key:string,value:any}
   */
  findProperty: {
    enumerable: false,
    value: function (testFun) {

      let prop = Object.entries(this).find((entry, index) => {
        return testFun(entry[1], entry[0], index);
      });


      let propInfo = {
        key: null,
        value: null
      };

      if (prop) {
        propInfo.key = prop[0];
        propInfo.value = prop[1];
      }

      return propInfo;
    }
  },


  /**
   * 检验该对象自身是否是扁平的，即：该对象的所有的直接属性的属性值都是非对象类型；
   */
  isFlat: {
    enumerable: false,
    get: function () {
      let noFlat = Object.values(this).some(function (propValue) {
        let propType = typeof propValue;
        return propType == "object" || propType == "function";
      });

      return !noFlat;
    }
  },




  /**
   * 返回对象是否是空的对象，即没有自己的可枚举的属性
   */
  noKeys:{
    enumerable:false,
    get:function(){
      return Object.keys(this).length == 0;
    }
  },





  /**
   * 获取对象中拥有的 相应key的值；
   * @param keys:[string]  指定的key的数组
   * @return [any]    对象中拥有的相应key的值
   */
  getValuesOfKeys: {
    enumerable: false,
    value: function (keys) {

      var _this = this ;
      return keys.reduce(function(total, currentKey){
        if (currentKey in _this){
          total.push(_this[currentKey]);
        }
        return total;
      }, []);

    }
  },



  /**
   * 获取对象中拥有的 相应key的 有效值；
   * 注意：不包含值为 undefined 或 null 的值
   * @param keys:[string]  指定的key的数组
   * @return [any]    对象中拥有的相应key的有效值
   *
   */
  getVirtualValuesOfKeys: {
    enumerable: false,
    value: function (keys) {

      var _this = this ;
      return keys.reduce(function(total, currentKey){
        var currValue = _this[currentKey] ;
        if (currValue != undefined){
          total.push(currValue);
        }
        return total;
      }, []);

    }
  },





  /**
   * 查找对象中所有指定的属性中的第一个有效值
   * @param keys : [string]   被查找的属性列表
   * @returns any  对象中所有指定的属性中的第一个有效值
   */
  findValueOfKeys: {
    enumerable: false,
    value: function (keys) {
      var findValue ;

      keys.find(function(currentKey){
        var currValue = this[currentKey] ;
        var valid =  currValue != undefined
        if (valid){
          findValue = currValue ;
        }
        return valid ;

      },this);


      return findValue;

    }
  },



  /**
   * 获取对象中所有指定格式的属性的值列表
   * @param key : string   基本的属性字符串
   * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
   * FormatObject := {separator : string, caseType : L | U | N}
   * @property separator  : string     分隔符
   * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
   * @returns [any]  对象中所有指定格式的属性的值列表
   */
  getValuesForKeyFormats: {
    enumerable: false,
    value: function (key,formats) {
      var keyStrList = key.getAllStrForFormats(formats);
      return this.getValuesOfKeys(keyStrList);
    }
  },


  /**
   * 获取对象中所有指定格式的属性的有效值列表
   * @param key : string   基本的属性字符串
   * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
   * FormatObject := {separator : string, caseType : L | U | N}
   * @property separator  : string     分隔符
   * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
   * @returns [any]  对象中所有指定格式的属性的值列表
   */
  getVirtualValuesForKeyFormats: {
    enumerable: false,
    value: function (key,formats) {
      var keyStrList = key.getAllStrForFormats(formats);
      return this.getVirtualValuesOfKeys(keyStrList);
    }
  },


  /**
   * 查找对象中所有指定格式的属性的第一个有效值
   * @param key : string   基本的属性字符串
   * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
   * FormatObject := {separator : string, caseType : L | U | N}
   * @property separator  : string     分隔符
   * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
   * @returns any  对象中所有指定格式的属性的第一个有效值
   */
  findValueForKeyFormats: {
    enumerable: false,
    value: function (key,formats) {
      var keyStrList = key.getAllStrForFormats(formats);
      return this.findValueOfKeys(keyStrList);
    }
  },





  //集合：开始

  /**
   * 判断当前对象是否是指定对象的子集；即当前对象自己的所有可枚举属性 及 值 是否都包含于 指定的对象上；
   * @param universalObj ? : Object   全集对象
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @returns boolean   当前对象是否是指定对象的子集
   */
  isSubsetOf: {
    enumerable: false,
    value: function (universalObj,equalTest) {

      if (!equalTest) {
        equalTest = function (a, b) {
          return a === b;
        };
      }

      let thisEntries = Object.entries(this);

      return thisEntries.every(function(entrie,index){
        let key = entrie[0];
        let value = entrie[1];
        return equalTest.call(this,value,universalObj[key]);
      },this);

    }
  },



  //集合：结束





  //URL相关：开始


  /**
   * toJSONqueryStringify(queryPrefix)
   * 把当前对象 用JSON的方式格式化成 URL 的参数格式
   * @param queryPrefix ? : boolean    可选；默认值：false; 是否带URL的查询字符串前缀 ?
   * @returns 格式化后的 URL 的参数格式
   *
   * 说明
   * 本方法是通过 JSONQueryStringify 方法进行格式化的
   */
  toJSONqueryStringify: {
    enumerable: false,
    value: function (queryPrefix) {
      return JSONQueryStringify(this,queryPrefix);
    }
  },


  //URL相关：结束




  /**
   * depthLoopOwnProperty(callback,depth,all,thisValue,initDepth)=> stopInfo
   * 递归遍历自身属性链中的所有属性
   * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 initDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 depthLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
   * @param depth ? : number    可选；默认值：-1 ,即无限深度； 要循环遍历的深度；
   * @param all ? : boolean    可选；默认值: false ;  是否遍历自身所有的属性，包括不可枚举的；
   * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
   * @param initDepth ? : number   可选；默认值：1；深度的初始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
   * @returns stopInfo ： any   终止循环时返回的信息；
   */
  depthLoopOwnProperty:{
    enumerable: false,
    value:function (callback,depth,all,thisValue,initDepth) {
      if (depth == undefined){
        depth = -1;
      }

      if (depth == 0){
        return;
      }

      if (initDepth == undefined){
        initDepth = 1;
      }


      if (thisValue === undefined) {
        thisValue = this;
      }

      if (all){
        var keyList = Object.getOwnPropertyNames(this);
      } else {
        keyList = Object.keys(this);
      }

      //中止遍历
      var stopInfo;

      for (let key of keyList){
        let value = this[key];
        if (typeof value == "object"){
          stopInfo = value.depthLoopOwnProperty(callback,depth-1,all,thisValue,initDepth+1);
          if (stopInfo){
            break;
          }
        }

        stopInfo = callback.call(thisValue,key,value,this,initDepth);
        if (stopInfo){
          break;
        }

      }


      return stopInfo;
    }


  },



  /**
   * depthLoopPropertyWithPrototype(callback,depth,thisValue,initDepth)=> stopInfo
   * 递归遍历自身包括原型的属性链中的所有可枚举的属性
   * @param callback : (key,value,obj,currDepth))=>stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 initDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 depthLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
   * @param depth ? : number    可选；默认值：-1 ,即无限深度； 要循环遍历的深度；
   * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
   * @param initDepth ? : number   可选；默认值：1；深度的初始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
   * @returns stopInfo ： any   终止循环时返回的信息；
   */
  depthLoopPropertyWithPrototype:{
    enumerable: false,
    value:function (callback,depth,thisValue,initDepth) {
      if (depth == undefined){
        depth = -1;
      }

      if (depth == 0){
        return;
      }

      if (initDepth == undefined){
        initDepth = 1;
      }


      if (thisValue === undefined) {
        thisValue = this;
      }

      //中止遍历
      var stopInfo;

      for (let key in this){

        let value = this[key];
        if (typeof value == "object"){
          stopInfo = value.depthLoopPropertyWithPrototype(callback,depth-1,thisValue,initDepth+1);
          if (stopInfo){
            break;
          }
        }

        stopInfo = callback.call(thisValue,key,value,this,initDepth);
        if (stopInfo){
          break;
        }
      }

      return stopInfo;

    }
  },


  /**
   * filterProperty(filter,thisValue)
   * 返回包含符合条件的所有属性的新对象
   * @param filter : (key,value,obj)=>boolean    必选；
   * @param thisValue ? : any   可选；默认值：当前对象； filter 函数的this 值；
   * @returns Object   返回包含符合条件的所有属性的新对象
   */
  filterProperty:{
    enumerable: false,
    value:function (filter,thisValue) {
      if (arguments.length < 2){
        thisValue = this;
      }

      return Object.entries(this).reduce((preValue,entr)=> {
        var key = entr[0];
        var value  = entr[1];
        if (filter.call(thisValue,key,value,this)){
          preValue[key] = value;
        }
        return preValue;
      },{});
    },
  },


};


Object.defineProperties(Object.prototype, propertyDescriptors);


/**
 * 用于将所有指定的属性的值从源对象复制到目标对象。它将返回目标对象。
 * @param target : Object     目标对象。
 * @param keys : Array<String>   需要复制的属性名数组
 * @param ...sources : Object    源对象参数序列
 * @return target    返回目标对象
 */

Object.assignKeys = function (target,keys,...sources){

  if (keys) {

    let keysSourceList = sources.map(function (source) {

      return keys.reduce(function (newSource, aKey) {
        let aValue = source[aKey];

        if (aValue !== undefined) {
          newSource[aKey] = aValue;
        }

        return newSource;

      }, {});

    });


    Object.assign(target,...keysSourceList);

  };


  return target ;
};


/**
 * 用于将所有指定的属性之外的所有属性和值从源对象复制到目标对象。它将返回目标对象。
 * @param target : Object     目标对象。
 * @param keys : Array<String>   需要排除的属性名数组
 * @param ...sources : Object    源对象参数序列
 * @return target    返回目标对象
 */

Object.assignExcludeKeys = function (target,keys,...sources){

  if (keys) {

    let keysSourceList = sources.map(function (source) {
      let allKeys = Object.keys(source);
      let validKeys = keys.getComplementOn(allKeys);

      return validKeys.reduce(function (newSource, aKey) {
        let aValue = source[aKey];

        if (aValue !== undefined) {
          newSource[aKey] = aValue;
        }

        return newSource;

      }, {});

    });


    Object.assign(target,...keysSourceList);

  };


  return target ;
};



/**
 * 用于将所有符合 options 配置 的属性和值从源对象复制到目标对象。它将返回目标对象。
 * @param target : Object     目标对象。
 * @param options : IncludeAndExcludeKeysOptions  必须；配置 包含 和 排除 的 key 的 数组 的 选项；
 * @param ...sources : Object    源对象参数序列
 * @return target    返回目标对象
 *
 * IncludeAndExcludeKeysOptions = {include ?: Array,exclude ?: Array}
 */

Object.assignIncludeAndExcludeKeys = function (target,options,...sources){

  if (options && !options.noKeys) {

    let keysSourceList = sources.map(function (source) {
      let allKeys = Object.keys(source);
      let validKeys = allKeys.getIncludeAndExclude(options);

      return validKeys.reduce(function (newSource, aKey) {
        let aValue = source[aKey];

        if (aValue !== undefined) {
          newSource[aKey] = aValue;
        }

        return newSource;

      }, {});

    });


    Object.assign(target,...keysSourceList);

  };


  return target ;
};







//兼容：开始

//Object.entries(obj)
if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
      i = ownProps.length,
      resArray = new Array(i);
    while (i--){
      var key = ownProps[i];
      resArray[i] = [key, obj[key]];
    }

    return resArray;
  };
}




//Object.fromEntries(entries)
if (!Object.fromEntries) {
  Object.fromEntries = function( entries ){
    return entries.reduce(function(obj, entry){
      obj[entry[0]] = entry[1];
      return obj;
    }, {});
  };
}



//兼容：结束










/**
 * 定义代理属性； 给 对象 proxy 增加 能够代理 target 对象 的 属性 prop；
 * 当在 访问或配置 proxy 对象上的 prop 属性时，会将操作转发到 target 对象的 prop 属性；
 *
 * @param proxy : Object   必选；会在该对象上添加代理属性 prop
 * @param target : Object   必选；被代理的对象
 * @param prop : Property   必选；代理属性的名字；
 * @param options ?: ProxyOptions  代理属性的配置选项
 *
 * ProxyOptions = {get:boolean,set:boolean,configurable:boolean,enumerable:boolean,getDefault,setDefault}
 * get:boolean  可选；默认值：true； 表示是否要定义 get 的代理；
 * set:boolean  可选；默认值：true； 表示是否要定义 set 的代理；
 * configurable:boolean  可选；默认值：true； 表示该属性描述符的类型是否可以被改变并且该属性可以从对应对象中删除。
 * enumerable:boolean  可选；默认值：true； 表示当在枚举相应对象上的属性时该属性是否显现。
 * getDefault:any  可选；当 target 的属性 prop 为 undefined 时，proxy 会返回默认值 getDefault
 * setDefault:any  可选；当给代理对象 proxy 的 prop 属性 设置的 新值是 undefined 时，会将默认值 setDefault 设置 到 target 对象的 prop 属性上；
 *
 * @returns proxy : Object  传递给函数的 代理对象 proxy
 */

Object.defineProxyProperty = function (proxy,target,prop, options) {
  var {get = true,set = true,configurable = true,enumerable = true,getDefault,setDefault} = options || {};

  var descriptor = {configurable,enumerable};

  if (get){
    descriptor.get = function () {
      var propValue = target[prop];
      return propValue === undefined ? getDefault : propValue;
    };
  }

  if (set){
    descriptor.set = function (newValue) {
      newValue = newValue === undefined ? setDefault : newValue;
      target[prop] = newValue;
    };
  }


  Object.defineProperty(proxy,prop,descriptor);
  return proxy;
};





/**
 * 批量定义代理属性
 *
 * 接口1：defineProxyProperties(proxy,target,propOptions)
 * @param proxy : Object   必选；会在该对象上添加代理属性 prop
 * @param target : Object   必选；被代理的对象
 * @param propOptions : {propName:ProxyOptions}   必选；要定义的代理属性的配置对象；以该配置对象的属性名为 要配置的属性的名字，以其值为 本配置的属性的 配置选项
 * @returns proxy : Object  传递给函数的 代理对象 proxy
 *
 *
 * 接口2：defineProxyProperties(proxy,target,propArray,options)
 * @param proxy : Object   必选；会在该对象上添加代理属性 prop
 * @param target : Object   必选；被代理的对象
 * @param propArray : [string]   必选；要定义的代理属性的名字的列表。
 * @param options ?: ProxyOptions     可选；所有代理属性的配置选项
 *
 *  @returns proxy : Object  传递给函数的 代理对象 proxy
 */
Object.defineProxyProperties = function (proxy,target,props, options) {
  var propsObj = props;
  if (Array.isArray(props)) {
    propsObj = props.reduce(function (total,propName) {
      total[propName] = options;
      return total;
    },{});
  }



  Object.keys(propsObj).forEach(function (propName) {
    let propOpts = propsObj[propName];
    Object.defineProxyProperty(proxy,target,propName,propOpts);
  });

  return proxy;
};


/**
 * isDepthEqual(a, b, nullNotEqualUndefined)
 * 深度测试  a 和 b 是否完全相等；如果 a 和 b 是 对象，会进行递归相等测试，只有所有的属性 都相等时，才会认为是相等的；
 *
 * 注意：
 * - 对于 值为 undefined 的属性 和 不存在的属性 认为是相等的属性；
 * - 对于 对于 函数 ，如果整个函数的代码字符（fun.toString()）串相等，则认为函数是相等的；
 * - 目前只判断了 基础类型、Object、Array、function、Date 类型；
 *
 * @param a : any
 * @param b : any
 * @param nullNotEqualUndefined ? : boolean    可选；默认值：false;  是否把 null 和 undefined 作为不等的值来对待
 * @return boolean
 */
Object.isDepthEqual = function isDepthEqual(a, b, nullNotEqualUndefined) {

  if (a === b || Object.is(a,b)) {
    return true
  }

  if (!nullNotEqualUndefined && a == null && a == b) {
    return true;
  }

  var aType = typeof a;
  var bType = typeof b;
  if (a != undefined && b != undefined){
    var aClassName = a.constructor.name;
    var bClassName = b.constructor.name;
  }


  if (aType != bType ) {
    if (aClassName && aClassName == bClassName){ //测试 基础类型 与 其包装类型 的相等性
      return a == b;
    }
    return false;
  }

  if  (aType == "function"){
    return  a == b || a.toString() == b.toString() ;
  }

  if (aType == "Date"){
    return  a.getTime() == b.getTime();
  }

  if (aType == "object") {
    var isArr = Array.isArray(a);
    if (isArr != Array.isArray(b)) {
      return false;
    }

    if (isArr) {
      if (a.length != b.leading) {
        return false;
      }

      return a.every(function (aValue, index) {
        var bValue = b[index];
        return Object.isDepthEqual(aValue, bValue, nullNotEqualUndefined);
      });

    }

    var aEntrs = Object.entries(a);
    var bEntrs = Object.entries(b);
    if (nullNotEqualUndefined) {
      aEntrs = aEntrs.filter(function (entr) {
        return entr[1] !== undefined
      });
      bEntrs = bEntrs.filter(function (entr) {
        return entr[1] !== undefined
      });
    } else {
      aEntrs = aEntrs.filter(function (entr) {
        return entr[1] != undefined
      });
      bEntrs = bEntrs.filter(function (entr) {
        return entr[1] != undefined
      });
    }

    if (aEntrs.length != bEntrs) {
      return false;
    }

    return aEntrs.every(function (aEntr) {
      var key = aEntr[0];
      var aValue = aEntr[1];
      var bValue = b[key];
      return Object.isDepthEqual(aValue, bValue, nullNotEqualUndefined);
    });


  }

  return a == b;
};
