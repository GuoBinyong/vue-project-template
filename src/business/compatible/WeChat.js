import Client from "./Client";

import Vue from 'vue'
import {WechatPlugin} from 'vux'

Vue.use(WechatPlugin);







/**
 * 给 window.shareInst 对象 添加计算属性 wx ，获取全局的微信的jssdk对象
 */
Object.defineProperty(window.shareInst, 'wx', {
  get: function () {
    return Vue.wechat;
  }
});


export default class WeChat extends Client {

  static  osName = "wechat" ;

  static synTest(){
    return /micromessenger/i.test(navigator.userAgent) || window.WeixinJSBridge ;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener("WeixinJSBridgeReady",resolve);
  }


  showWebNavBar = false; //是否显示 web 导航条 ；

  payType = shareData.payMethodMap.weChatPublic.type;   //支付类型





  //支付：开始


  /**
   * 支付
   * @param payOptions : Object   支付参数
   * @returns Promise<any>
   */
  payment(payOptions) {
    let payType = payOptions.payType;

    if (payType && payType != this.payType) {
      return super.payment(payOptions);
    }

    if (weChatConf.payUseJSBridge) {
      return this._bridgePayment(payOptions)
    } else {
      return this._sdkPayment(payOptions);
    }

  }


  //支付：结束








  //导航条：开始

  _setWechatTitle(title, img) {
    if (title === undefined || window.document.title === title) {
      return
    }
    document.title = title
    var mobile = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(mobile)) {
      var iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      // 替换成站标favicon路径或者任意存在的较小的图片即可
      iframe.setAttribute('src', img || '/favicon.ico')
      var iframeCallback = function () {
        setTimeout(function () {
          iframe.removeEventListener('load', iframeCallback)
          document.body.removeChild(iframe)
        }, 0)
      }
      iframe.addEventListener('load', iframeCallback)
      document.body.appendChild(iframe)
    }
  }


  updateNavTitleOptions(navTitleOptions) {
    let {title, subtitle} = navTitleOptions;
    let titleText = (title && title.text) || (subtitle && subtitle.text);
    this._setWechatTitle(titleText);
  }


  //导航条：结束

}
