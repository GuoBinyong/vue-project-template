import Client, {clientEventNameMap} from "./Client";

import {ConditionBack,augModeMap,Actions,Conditions} from ':libraries/ConditionBack/index.js'

export default class Alipay extends Client {


  static  osName = "alipay" ;

  static synTest(){
    return  window.AlipayJSBridge  || /alipay/i.test(navigator.userAgent) ;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener('AlipayJSBridgeReady', resolve);
  }



  showWebNavBar = false; //是否显示 web 导航条 ；

  // osName = osName.alipay;

  navBarClickHandles = {
    title: null,
    subtitle: null,
    rightButtons: []
  };


  constructor() {
    super();
    this._init();
  }


  /*
  该方法用于创建被父类依赖的属性（简称：父类依赖属性） ；

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initProperty()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initProperty(){
    super.initProperty();


    /**
     * 追加的 backMap
     * @type {key:ConditionBack}
     * @private
     */
    this.appendBackMap = {

      /**
       * 如果 Locat 是有效数字，则 用 AlipayJSBridge.call('popWindow') 关闭当前的 window ；
       * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
       */
      Alipay: new ConditionBack({
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction((backLocat, conditionResult, conditionBack)=> {

          if  (this.alipayWebPayPageLocat){
            // 关闭当前打开的页面

            let popData = null;

            if (backLocat) {
              popData = {
                command: "router",
                params: {
                  data:backLocat
                }
              };
            }

            AlipayJSBridge.call('popWindow', {
              data:popData
            });
          }else {
            shareInst.router.pushWithData(backLocat);
          }

        }, (backLocat, conditionResult, conditionBack)=> {

          if  (this.alipayWebPayPageLocat){
            // 关闭当前打开的页面

            let popData = null;

            let backStepNum = backLocat - 1;
            if (backStepNum !== 0) {
              popData = {
                command: "router",
                params: {
                  data:-backStepNum
                }
              };
            }

            AlipayJSBridge.call('popWindow', {
              data:popData
            });
          }else {
            shareInst.router.go(-backLocat);
          }

        }),
        augMode: augModeMap.constant,
        augmenter: 0
      })


    };


  }

  _init() {
    this._addEventListener();
  }




  /**
   * 添加事件监听
   * @private
   */
  _addEventListener(){

    this._addNavBarEventListeners({
      titleClick: "title",
      subtitleClick: "subtitle",
      optionMenu: "rightButtons"
    });


    //备注：10.0.15客户端以上，容器新增了"pagePause","pageResume","appPause","appResume"事件，用于业务区分是哪种情况触发的pause 或 resume。
    document.byAddListenerForMultipleEvent(["pause","resume","pagePause","pageResume","appPause","appResume"], (event)=>{


      let clientEventName = null ;
      let data = null ;

      switch (event.type) {
        case "pause" :{
          clientEventName = clientEventNameMap.webHide ;
          break;
        }

        case "resume" :{
          clientEventName = clientEventNameMap.webShow ;
          data = event.data ;
          break;
        }


        case "pagePause" :{
          clientEventName = clientEventNameMap.webHide ;
          break;
        }

        case "pageResume" :{
          clientEventName = clientEventNameMap.webShow ;
          // data = event.data ;
          break;
        }

        case "appPause" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }

        case "appResume" :{
          clientEventName = clientEventNameMap.foreground ;
          // data = event.data ;
          break;
        }

      }


      this.dispatchClientEvent(clientEventName,data) ;


    });

  }




  /**
   * webview 显示
   */
  webShowHandle(data){
    super.webShowHandle(data);

    let exeResult = this.executeCommand(data);
    if (!exeResult.finish) {
      //如果命令末执行成功

    }

  }





  _transformBtnOptClickToFun(btnOptClick) {

    let clickFun = null;

    if (btnOptClick) {

      if (typeof btnOptClick == "function") {
        clickFun = btnOptClick;
      } else {

        clickFun = (event) => {
          this.pushWithData(btnOptClick, event);
        };

      }

    }


    return clickFun;
  }

  /**
   * 批量添加导航条的事件
   * @param eventOptions : {[eventName:string]:[navBarClickHandleName:string]}  添加事件的配置对象；该对象的属性名是要添加的事件名，属性值是 navBarClickHandles 中对应的事件处理程序的属性名；
   * @private
   */
  _addNavBarEventListeners(eventConf) {

    Object.keys(eventConf).forEach((eventName) => {

      document.byAddEventListener(eventName, (event) => {


        let handleKey = eventConf[eventName];
        let handle = this.navBarClickHandles[handleKey];
        switch (eventName) {
          case "optionMenu" : {
            let handIndex = event.data.index;
            handle = handle[handIndex];
            break;
          }

        }


        if (handle) {
          handle(event);
        }

      }, false);
    });

  }


  updateNavTitleOptions(standTitleOptions) {
    let {title, subtitle} = standTitleOptions;

    let params = {
      title: (title && title.text) || '\u200b',
      subtitle: (subtitle && subtitle.text) || '\u200b'
    };


    this.navBarClickHandles.title = title && this._transformBtnOptClickToFun(title.click);
    this.navBarClickHandles.subtitle = subtitle && this._transformBtnOptClickToFun(subtitle.click);

    AlipayJSBridge.call('setTitle', params);
  }


  updateNavRightOptions(navRightOptions) {
    let {more, buttonOptionsList} = navRightOptions;


    let params = {};
    let rightButtons = [];


    if (!more.hide || buttonOptionsList) {

      let menus = [];
      if (buttonOptionsList) {

        buttonOptionsList.forEach((btnOpt) => {
          menus.push({title: btnOpt.text});
          let btnHandle = this._transformBtnOptClickToFun(btnOpt.click);
          rightButtons.push(btnHandle);
        });

      }

      if (!more.hide) {
        let aliMore = {
          icontype: more
        };
        menus.unshift(aliMore);
        let moreHandle = this._transformBtnOptClickToFun(more.click);
        rightButtons.unshift(moreHandle);

      }


      params.menus = menus;
      params.override = true;

    } else {
      params.reset = true;
    }

    this.navBarClickHandles.rightButtons = rightButtons;

    AlipayJSBridge.call('setOptionMenu', params);
    AlipayJSBridge.call('showOptionMenu');

  }


  //二维码：开始

  /**
   * 热苗二维码或者条形码
   * @param scanOptions : ScanOptions  二维码配置对象
   * scanOptions.type : QR_Type常量 | Bar_Type常量 扫描目标类型
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string  二维码条形码的code
   *
   * 失败的回调参数 error
   * error.code;     错误编码
   *
   */
  scanQRCode(scanOptions = {}) {
    let {type = shareData.QR_Type} = scanOptions;

    return new Promise((resolve, reject) => {

      let apOptions = {
        type: type,
        actionType: 'scan'
      };

      AlipayJSBridge.call('scan', apOptions, function (result) {
        let {error, barCode, qrCode, cardNumber} = result;


        if (error == 0) {

          let result = {};

          if (qrCode) {
            result.type = shareData.QR_Type;
            result.code = qrCode;
          } else {
            result.type = shareData.Bar_Type;
            result.code = barCode;
          }

          resolve(result);

        } else {
          reject({code: error});
        }

      });

    });

  }


  scanQRCodeFromImg(scanOptions) {
    return this.scanQRCode(scanOptions);
  }


  //二维码：结束














  //生活号支付兼容处理：开始

  /*
   - 由于在生活号中调用支付宝支付后，支付宝会清空当前的历史栈，导致无法返回上级页面，所以在生活号中需要此兼容模块来处理；
   - 由于 web2app 的 matchUrls 出现了问题，导致不能自动匹配 url ，导致在当前窗口加载支付宝页面，所以在 app 中 该问题解决之前需要此兼容模块来处理；

   解决方案：
   1. 在新的 window 中拉起支付；
   2. 返回时关闭支付的 window ;


   使用方式：
   1. 创建个用于在新 window 中调起支付的页面，称为 支付拉起页面；
   3. 在 支付拉起页面 中调用 Alipay 的实例的 continuePay 方法；
   2. 把 支付拉起页面 的位置（也可以是 URL地址）设置给 Alipay 的实例的 alipayWebPayPageLocat 属性；


   注意：
   如果 Alipay 的实例的 alipayWebPayPageLocat 属性无值，则会使用父类的支付逻辑，即：不是在支付宝的新window中进行支付的；

   */




  /**
   * 是否在新的窗口中启动支付宝的网页支付
   * 新的窗口中打开的页面由 this.alipayWebPayPageLocat 指定；
   */
  alipayWebPayOnNewWindow = true;


  /**
   * 为 支付宝网页支付打开新的窗口
   * @param payPageURLStr : UrlString   用于拉起支付宝网页支付 的页面地址
   * @returns {complete: boolean, info: any}
   * @private
   */
  _openWindowForAlipayWebPay(payPageURLStr){

    //用新 window 打开支付页
    AlipayJSBridge.call('pushWindow', {
      url: payPageURLStr
    });

    return {complete:true, info: "调用支付成功"};

  }



  //生活号支付兼容：结束






}
