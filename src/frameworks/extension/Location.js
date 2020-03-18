let propertyDescriptors = {
  /**
   * searchParams
   * 注意：
   * 该属性是计算属性，每一都会返回一个新的 URLSearchParams 实例；所以，若想通过该属性更改url的参数，需要给该属性重新赋值，而不能基于该属性返回的 URLSearchParams 的实例设置；
   */
  searchParams: {
    enumerable: false,
    get: function () {
      return new window.URLSearchParams(this.search);
    },

    set:function (newValue) {
      this.search = newValue.toString();
    }
  },


  /**
   * get:把 URLSearchParams 转换对象形式；
   * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
   */
  params: {
    enumerable: false,
    get: function () {
      return parseQueryString(this.search,function (value) {
        return JSON.correctParse(value);
      });
    },

    set:function (newValue) {
      this.search = queryStringify(newValue,function (value,key,params) {
        if (typeof value == "object"){
          value = JSON.stringify(value);
        }
        return value;
      });
    }
  },
};


Object.defineProperties(Location.prototype, propertyDescriptors);
