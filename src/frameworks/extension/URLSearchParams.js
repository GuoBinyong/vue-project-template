
if (!window.URLSearchParams && window.URL && window.URL != window.ByURL){
  var _URLsearchParamsInst_ = (new window.URL("gby://guo.bin.yong")).searchParams;
  var _URLSearchParamsConstructor_ = _URLsearchParamsInst_ && _URLsearchParamsInst_.constructor;
  if (typeof _URLSearchParamsConstructor_ == "function" ) {
    window.URLSearchParams = _URLSearchParamsConstructor_;
  }else {
    window.URLSearchParams = window.ByURLSearchParams;
  }
}


let propertyDescriptors = {

  /**
   * toParams()
   * 把 URLSearchParams 转换对象形式；
   */
  toParams: {
    enumerable: false,
    value: function () {
      let params = {};

      this.forEach(function(value, key) {
        params[key] = value;
      });

      return params;
    }
  },

  /**
   * clear()
   * 清除所有的 key
   */
  clear:{
    enumerable: false,
    value: function () {
      safelyIterate(this.keys(),(key)=> {
        this.delete(key);
      });
    }
  },



  /**
   * appendParams(params)
   * 将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
   * @param params : Object | string | URLSearchParams  该 对象自身 或 查询字符串 的所有成员都会被插入进来
   *
   * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
   */
  appendParams:{
    enumerable: false,
    value: function (params) {

      var paramsSP = params;
      switch (params.constructor){
        case String:{
          paramsSP = new window.URLSearchParams(params);
        }
        case window.URLSearchParams:{
          paramsSP.forEach( (value, key)=> {
            this.append(key,value);
          });
          break;
        }

        default:{

          Object.keys(params).forEach( (key)=> {
            this.append(key,params[key]);
          });

        }
      }


    }
  },


  /**
   * setParams(params)
   * URLSearchParams接口的 setParams(params) 方法用于将 params  对象自身 或 查询字符串 的所有可枚举成员 设置成搜索参数的成员。如果设置前已经存在匹配的值，该方法会删除多余的，如果将要设置的值不存在，则创建它
   * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
   *
   * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
   */
  setParams:{
    enumerable: false,
    value: function (params) {

      var paramsSP = params;
      switch (params.constructor){
        case String:{
          paramsSP = new window.URLSearchParams(params);
        }
        case window.URLSearchParams:{
          paramsSP.forEach( (value, key)=> {
            this.set(key,value);
          });
          break;
        }

        default:{

          Object.keys(params).forEach( (key)=> {
            this.set(key,params[key]);
          });

        }
      }



    }
  },



  /**
   * resetParams(obj)
   * 清除之前所有的搜索参数，并将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
   * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
   */
  resetParams:{
    enumerable: false,
    value: function (params) {
      this.clear();
      this.appendParams(params);
    }
  },


};

if (window.URLSearchParams) {
  Object.defineProperties(window.URLSearchParams.prototype, propertyDescriptors);
}
