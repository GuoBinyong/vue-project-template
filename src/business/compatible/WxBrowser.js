import WeChat from "./WeChat";

import {getWeiXinCongfig} from ':network/Api' ;


//配置：开始
const weChatConf = {
  jsApiList: ['chooseWXPay'],    //微信接口列表
  payUseJSBridge: true, //是否使用  WeixinJSBridge 的支付接口
};

//配置：结束





export default class WxBrowser extends WeChat {

  static  osName = "wxBrowser" ;

  static synTest(){
    return /micromessenger(?!.*miniprogram)/i.test(navigator.userAgent) || ( window.__wxjs_environment && !(/miniprogram/i.test(window.__wxjs_environment)) ) ;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener("WeixinJSBridgeReady",()=>{

      if (this.synTest()){
        resolve();
      } else {
        reject();
      }

    });
  }


  showWebNavBar = false; //是否显示 web 导航条 ；

  payType = shareData.payMethodMap.weChatPublic.type;   //支付类型


  constructor() {
    super();

    this._addEventListener();

  }



  /**
   * 添加事件监听
   * @private
   */
  _addEventListener(){

    shareInst.httpReady.then( ()=> {
      let url = location.href;
      this._readyForUrl(url);
    });

    shareInst.routerReady.then( ()=> {
      shareInst.router.afterEach((to, from) => {
        let toCopy = Object.assign({},to);
        let currentUrl = shareInst.router.locationToURLStr(toCopy);
        // let currentUrl = to.fullPath;
        this._readyForUrl(currentUrl);
      });
    });


  }


  _readyForUrl(url) {
    return this.ready = new Promise((resolve, reject) => {

      this._wxConfig(url);

      shareInst.wx.ready(function (result) {
        resolve(result);
      });

      shareInst.wx.error(function (result) {
        reject(result);
      });

    });
  }


  _wxConfig(currentUrl) {

    getWeiXinCongfig(currentUrl).then(function (mainData) {

      let {appId: appId, timestamp: timestamp, noncestr: nonceStr, signature: signature} = mainData;
      let debug = (window.byDebug && window.byDebug.wechat) || false ;

      let wxConfig = {
        debug: debug,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId,  // 必填，公众号的唯一标识
        timestamp: timestamp,  // 必填，生成签名的时间戳
        nonceStr: nonceStr,  // 必填，生成签名的随机串
        signature: signature,  // 必填，签名
        jsApiList: weChatConf.jsApiList // 必填，需要使用的JS接口列表
      };

      shareInst.wx.config(wxConfig);

    });


  }


  //二维码：开始

  /**
   * 热苗二维码或者条形码
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string  二维码条形码的code
   *
   * 失败的回调参数 error
   *
   */
  scanQRCode() {
    return new Promise(function (resolve, reject) {

      shareInst.wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        success: function (res) {

          let result = {
            code: res.resultStr  // 当needResult 为 1 时，扫码返回的结果
          };

          resolve(result);
        },
        fail: function (error) {
          reject(error);
        }
      });

    });
  }


  scanQRCodeFromImg() {
    return this.scanQRCode();
  }


  //二维码：结束


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


  /**
   * 通过JSSdk 进行支付
   * @param payOptions
   * @returns Promise<any>
   * @private
   */
  _sdkPayment(payOptions) {

    let {timeStamp, nonceStr, package: prepay_id, signType, paySign} = payOptions.payString;

    return this.ready.then(function (result) {

      return new Promise(function (resolve, reject) {

        shareInst.wx.chooseWXPay({
          timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
          package: prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: paySign, // 支付签名
          success: function (res) {
            resolve(res);
          },
          fail: function (error) {
            reject(error);
          }

        });

      });


    });

  }


  /**
   * 通过WeixinJSBridge进行支付
   * @param payOptions
   * @returns {Promise<any>}
   * @private
   */
  _bridgePayment(payOptions) {

    let payString = payOptions.payString;

    return new Promise(function (resolve, reject) {

      window.WeixinJSBridge.invoke('getBrandWCPayRequest', payString,
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            resolve(res);
          } else {
            reject(res);
          }
        });

    });

  }


  _setWechatTitle(title, img) {
    if (title === null){
      title = "";
    }
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


}
