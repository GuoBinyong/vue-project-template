import * as By from "by-browser"
import "nav-type"
import "vue-exp"
// import Vue from "vue"


// import  "vuex-expand"

// import {ByHttp} from "by-http"
// import VueRouterExtendPlugin from "./libraries/VueRouterExtendPlugin"






declare global {


  // 容器对象
  interface ContainerObject {
    [prop: string]: any;
    [prop: number]: any;
  }

  // shareInst 的类型
  interface ShareInst extends ContainerObject {
  }

  // 用于挂载共享实例的全局对象
  var shareInst: ShareInst;

  // shareData 的类型
  interface ShareData extends ContainerObject {
  }

  // 用于挂载共享数据的全局对象
  var shareData: ShareData;

  var by: typeof By;
}




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



window.by = By;
