
//URL扩展：开始
if (!window.URL && window.webkitURL){
  window.URL = window.webkitURL;
}

let propertyDescriptors = {

  /**
   * get:把 URLSearchParams 转换对象形式；
   * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
   */
  params: {
    enumerable: false,
    get: function () {
      return this.searchParams.toParams();
    },

    set:function (newValue) {
      this.searchParams.resetParams(newValue);
    }
  },
};

if (window.URL){
  Object.defineProperties(window.URL.prototype, propertyDescriptors);
}

//URL扩展：结束
