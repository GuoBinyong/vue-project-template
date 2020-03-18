import BaseClient from ':libraries/BaseClient'
import {BackScheme,ConditionBack,augModeMap,Actions,Conditions} from ':libraries/ConditionBack/index.js'
import {redirectCA,goLocatUseRouterA} from ':tools/ConditionAction.js'
import CmdURL from ':tools/CommandURL.js'





//应用事件名字常量
export const clientEventNameMap = {
  background:"background",  //应用进入后台
  foreground: "foreground", //应用进入前台
  launch: "launch", //应用启动
  webClosed: "webClosed", //webview将要被关闭
  willQuit: "willQuit", //应用将要被退出
  webShow: "webShow" ,  //webview 显示
  webHide: "webHide" ,  //webview 隐藏
};


export default class Client extends BaseClient{


  constructor(...rest){
    super(...rest);
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
    /*
    创建返回方案实例；

    注意：
    该属性不可以以类的实例属性的方式创建；因为该属性会在 initAction 中用到；如果以类的实例属性的方式创建，则会造成：在执行 initAction 时，该属性还末创建的问题；
    */

    this.backScheme = new BackScheme(
      //backMap
      {

        Redirect: new ConditionBack({
          condition: redirectCA.conditions.judgeIsRedirect,
          action: redirectCA.actions.createRedirectAction(),
          augMode: augModeMap.constant,
          augmenter: 1
        }),


        /**
         * 如果 Locat 是有效数字，则执行正常的 ConditionBack 返回 ；
         * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
         */
        WXH5Pay: new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 1
        }),

        /**
         * 如果 Locat 是有效数字，则执行正常的 ConditionBack 返回 ；
         * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
         */
/*        Alipay: new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 3
        }),*/


        /**
         * 如果 Locat 是有效数字，则 用 AlipayJSBridge.call('popWindow') 关闭当前的 window ；
         * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
         */
        Alipay: new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action: Actions.createJudgeLocatIsNumberAction((backLocat, conditionResult, conditionBack)=> {

            if  (this.isOnNewWindowForAlipayWebPay && window.opener){

              window.opener.shareInst.router.pushWithData(backLocat)

              // 聚焦到 opener 窗口
              window.opener.focus();


            }else {
              shareInst.router.pushWithData(backLocat);
            }

          }, (backLocat, conditionResult, conditionBack)=> {

            if  (this.isOnNewWindowForAlipayWebPay && window.opener){
              // 关闭当前打开的页面
              let backStepNum = backLocat - 1;
              window.opener.history.go(-backStepNum)

              // 聚焦到 opener 窗口
              window.opener.focus();

            }else {
              shareInst.router.go(-backLocat);
            }

          }),
          augMode: augModeMap.callBack,
          augmenter:  ()=> {  //如果是在新窗口打开的支付页面，则 augmenter 为 0 ；否则，为 3
            let isOnNewWindow = this.isOnNewWindowForAlipayWebPay && window.opener ;
            return isOnNewWindow ? 0 : 3 ;
          }
        })

      },
      //backStack
      [


        /**
         * 当 locat 是 不是 number 类型时，用 router 导航 locat
         */
        new ConditionBack({
          condition: Conditions.locatIsNotNumber,
          action: goLocatUseRouterA,
          augMode: augModeMap.constant,
          augmenter: 0
        }),




        /**
         * 在有重定向标识时执行重定向
         */
        new ConditionBack({
          condition: redirectCA.conditions.isRedirect,
          action: Actions.normal,
          augMode: augModeMap.constant,
          augmenter: 1
        }),



        /**
         * 做正常的返回或者路由导航
         * 此 conditionBack 一般放在最后
         */
        new ConditionBack({
          condition: Conditions.judgeLocatIsNumber,
          action:Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
          augMode: augModeMap.constant,
          augmenter: 0
        })



      ]);

  }



  /*
  该方法用于执行依赖子类属性的操作（简称：子类依赖操作）

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initAction()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initAction(){
    super.initAction();

    // 添加子类自己设置的 appendBackMap 和 backStack : 开始

    let appendBackMap = this.appendBackMap ;
    if (appendBackMap) {
      this.backScheme.appendBackMap(this.appendBackMap);
    }

    let backStack =  this.backStack ;
    if (backStack) {
      this.backScheme.backStack = backStack ;
    }

    // 添加子类自己设置的 appendBackMap 和 backStack : 结束

  }





  //环境检测：开始


  //系统名字
  static  osName = "client" ;


  /**
   * 同步测试
   * @return boolean    表示是否是当前类型的对应的客户环境
   */
  static synTest(){
    return false;
  }

  /**
   * 异步测试
   * @param resolve : function   , 测试成功的回调函数
   * @param reject  : function   , 测试失败的回调函数
   */
  static asynTest(resolve, reject){

  }


  //环境检测：结束





  //事件：开始


  /**
   * 应用进入前台的处理器
   */
  foregroundHandle(data){
    let exeResult = this.executeCommand(data);

    if (!exeResult.finish) {
      //如果命令末执行成功

    }

  }




  /**
   * 应用进入后台的处理器
   */
  backgroundHandle(data){

  }



  /**
   * 应用启动的处理器
   */
  launchHandle(data){

  }



  /**
   * webview关闭的处理器
   */
  webClosedHandle(data){

  }


  /**
   * 应用将要退出的处理器
   */
  willQuitHandle(data){

  }


  /**
   * webview 显示
   */
  webShowHandle(data){

  }


  /**
   * webview 隐藏
   */
  webHideHandle(data){

  }


  //事件：结束




  //命令：开始

  /**
   * 执行命令
   * @param data: string | { protocol: string ,namespaces : string ,command: string ,params: any}     命令数据
   */
  executeCommand(data){

    let exeResult = {
      finish: false,
      info: null
    };

    if (!data) {
      return exeResult ;
    }

    let cmdObj = data;

    if (typeof data == "string") {
      cmdObj = CmdURL.parse(data) ;
    }

    let { namespaces,command,params } = cmdObj ;

    let cmdData = params && params.data ;

    if (!command) {
      return exeResult;
    }

    switch (true) {

      //通过URL跳转
      case command.includes("url") :{
        window.location.href = cmdData ;
        exeResult.finish = true;
        break;
      }


      //通过 router 跳转
      case command.includes("router")  :{
        shareInst.router.pushWithData(cmdData);
        exeResult.finish = true;
        break;
      }

    }



    return exeResult;

  }


  //命令：结束







  scheme = "http" ;   //客户的 Scheme

  showWebNavBar = true; //是否显示 web 导航条 ；






  /**
   * 准备状态
   * @return {Promise<void> | *}
   */
  get ready() {
    if (!this._ready) {
      this._ready = Promise.resolve();
    }

    return this._ready;
  }


  set ready(newValue){
    if  (newValue == null || newValue instanceof Promise){
      this._ready = newValue;
    }
  }





  //支付：开始



  /**
   * 把 位置对象 loca 转成微信的回调地址
   * @param loca : Location   位置对象
   * @return string   微信的回调地址
   * @private
   *
   */
  _weChatRedirectUrlForLocat(loca){
    return shareInst.router.locationToURLStr(loca) ;
  }


  /**
   * 默认的支付操作完成后跳转的位置
   * @type string | RouteLocation 支付流程结束后跳转的位置，可以是完整的url字符串，或者 router 的位置对象；
   */
  defaultPayNextLocat = {path: "/confirmLoading"};


  /**
   * 支付
   * @param payOptions
   * @returns Promise<any>
   *
   * payOptions 中可能包含的字段如下：
   * payType : 支付类型
   * nextLocation : string | RouteLocation | false 支付流程结束后跳转的位置，可以是完整的url字符串，或者 router 的位置对象；如果值为 false ，则表示不进行跳转
   *
   */
  payment(payOptions) {
    let {payType, nextLocation = this.defaultPayNextLocat} = payOptions;


    return new Promise((resolve, reject) => {

      let result = null;

      switch (payType) {
        case shareData.payMethodMap.weChatWeb.type : {
          let payString = payOptions.payString;
          let mweb_url = payString && payString.mweb_url;
          let redirect_url = nextLocation == false ? null : this._weChatRedirectUrlForLocat(nextLocation);
          result = this._weChatWebPay(mweb_url, redirect_url);

          break;
        }
        case shareData.payMethodMap.alipay.type: {
          result = this._alipayWebPay(payOptions.payString);
          break;
        }
        case shareData.payMethodMap.alipayApp.type: {
          result = this._alipayWebPay(payOptions.payString);
          break;
        }
      }


      if (result.complete) {
        resolve(result.info);
      } else {
        console.error(result.info);
        reject(result.info);
      }


    });


  }






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
   * 判断当前是否需要在新窗口中进行支付宝支付
   * @returns {boolean|Location|URLStr}
   */
  get isOnNewWindowForAlipayWebPay(){
    return this.alipayWebPayOnNewWindow && this.alipayWebPayPageLocat
  }




  /**
   * 是否在新的窗口中启动支付宝的网页支付
   * 新的窗口中打开的页面由 this.alipayWebPayPageLocat 指定；
   */
  alipayWebPayOnNewWindow = false;


  /**
   * 当在生活号中用支付宝支付时，在新的window中打开的用于支付的页面的路由位置 或者 URL 字符地址
   * @type Location | URLStr
   *
   * 注意：
   * 如果 Alipay 的实例的 alipayWebPayPageLocat 属性无值，则会使用父类的支付逻辑，即：不是在支付宝的新window中进行支付的；
   */
  alipayWebPayPageLocat = null ;


  //用于存储 alipayPayData 的 key； alipayPayData 是传给新的 window 的用于支付的数据
  alipayPayDataKey = "alipayPayData";


    /**
   * 在网页中进行的支付宝支付
   * @param payHtmlStr : 支付宝返回的 html 文本
   * @returns {complete: boolean, info: any}
   * @private
   */
  _alipayWebPay(payHtmlStr){

    let result = {
      complete:false,
      info:"payHtmlStr无效"
    };

    if (!payHtmlStr) {
      result.info = "payHtmlStr无效" ;
    }else if (this.isOnNewWindowForAlipayWebPay) {  // 如果 this.alipayWebPayPageLocat 允许 且 this.alipayWebPayPageLocat 属性有值，则会在支付宝的新window中进行支付；


      let alipayPayData = {
        payHtmlStr:payHtmlStr,
        valid : true
      };
      localStorage.setAnyItem(this.alipayPayDataKey, alipayPayData);

      let payPageURLStr = shareInst.router.locationToURLStr(this.alipayWebPayPageLocat) ;
      result = this._openWindowForAlipayWebPay(payPageURLStr);

    }else {   // 否则，则会使用父类的支付逻辑，即：不是在支付宝的新window中进行支付的；
      result = this._alipayWebPayLaunch(payHtmlStr);
    }


    return result;

  }


  /**
   *
   * 为 支付宝网页支付打开新的窗口
   * @param payPageURLStr : UrlString   用于拉起支付宝网页支付 的页面地址
   * @returns {complete: boolean  是否完成, info: any  信息}
   * @private
   *
   *
   * 注意：
   * - 子类可重载该方法：因为不同的客端端类型打开新窗口的方式不一样，因为该方法需要被打开方式有差异的端给重载
   *
   */
  _openWindowForAlipayWebPay(payPageURLStr){

    //用新 window 打开支付页

    let payWinRef = window.open(payPageURLStr, "Alipay");

    if (payWinRef) {
      return {complete:true, info: "调用支付成功"};
    }else {
      return {complete:false, info: "调用支付失败"};
    }

  }


  /**
   * 继续支付
   * @returns {complete: boolean, info: string}
   *
   *
   * 注意：
   * - 此方法用于并且需要在 支付拉起页面 调用；
   * - 支付拉起页面 是用于在新 window 中调起支付的页面；
   * - 需要把 支付拉起页面 的位置（也可以是 URL地址）设置给 Alipay 的实例的 alipayWebPayPageLocat 属性；
   */
  continuePay(){

    let result = {
      complete:false,
      info:"payHtmlStr无效"
    };



    let alipayPayData = localStorage.getParsedItem(this.alipayPayDataKey);


    if (alipayPayData && alipayPayData.valid) {
      result = this._alipayWebPayLaunch(alipayPayData.payHtmlStr);

      alipayPayData.valid = false ;
      localStorage.setAnyItem(this.alipayPayDataKey, alipayPayData);
    }

    return result ;

  }




  /**
   * 拉起支付宝支付
   * @param payHtmlStr : 支付宝返回的 html 文本
   * @returns {complete: boolean, info: any}
   * @private
   */
  _alipayWebPayLaunch(payHtmlStr) {

    let result = {
      complete: false,
      info: "参数不正确"
    };

    let payEle = document.createElement("div");
    payEle.innerHTML = payHtmlStr;
    document.body.appendChild(payEle);
    let fromEle = payEle.getElementsByTagName("form")[0];

    if (fromEle) {
      fromEle.submit();

      result.complete = true;
      result.info = "调用支付成功";
    }


    return result;
  }




  //生活号支付兼容：结束





  /**
   * 在网页中进行的微信支付
   * @param mwebUrl  : 微信的支付页面
   * @param redirectUrl : 支付流程结束后的返回页面
   * @returns {complete: boolean, info: any}
   * @private
   */
  _weChatWebPay(mwebUrl, redirectUrl) {
    let result = {
      complete: true,
      info: "成功调用支付"
    };

    if (mwebUrl) {


      let paramsStr = "";

      if (redirectUrl) {
        redirectUrl = encodeURIComponent(redirectUrl);
        paramsStr = `&redirect_url=${redirectUrl}`;
      }

      let finalMwebUrl = mwebUrl + paramsStr ;

      this._weChatWebPayLaunchMwebUrl(finalMwebUrl) ;


    } else {

      result.complete = false;
      result.info = "mwebUrl不能为空";
    }


    return result;

  }

  /**
   * 加载微信支付的页面
   * @param mwebUrl
   * @private
   */
  _weChatWebPayLaunchMwebUrl(mwebUrl){
    window.location.href = mwebUrl ;
  }


  //支付：结束






  //导航条：开始
  updateNavBarOptions(navBarOptions) {

    if (!this.showWebNavBar) {
      let {left, title, right} = navBarOptions;
      let standardTitleOptions = this._transformTitleOptionsToStandard(title);

      this.updateNavLeftOptions(left);
      this.updateNavTitleOptions(standardTitleOptions);
      this.updateNavRightOptions(right);

    }

  }


  _transformTitleOptionsToStandard(navTitleOptions) {
    let {title: titleOptions, buttonOptionsList} = navTitleOptions;

    let titleBtnOptions = null;
    let subTitleBtnOptions = null;


    if (titleOptions.hide) {

      if (buttonOptionsList) {
        titleBtnOptions = buttonOptionsList[0];
        subTitleBtnOptions = buttonOptionsList[1];
      }


    } else {
      titleBtnOptions = titleOptions;
      subTitleBtnOptions = buttonOptionsList && buttonOptionsList[0];
    }


    let standardTitleOptions = {
      title: titleBtnOptions,
      subtitle: subTitleBtnOptions
    };


    return standardTitleOptions;

  }


  updateNavLeftOptions(navLeftOptions) {

  }

  updateNavTitleOptions(navTitleOptions) {

  }


  updateNavRightOptions(navRightOptions) {

  }


  //导航条：结束


  //二维码：开始

  /**
   * 通过图片扫描条码数据
   * @param path
   * @param filters
   * @return {Promise<any>}
   */
  scanQRCodeFromImg({path, filters}) {
    return Promise.reject({message: "无法调取摄像头"});
  }


  scanQRCode(scanOptions) {
    return Promise.reject({message: "无法调取摄像头"});
  }


  /**
   * 开始条码识别
   * 开始调用系统摄像头获取图片数据进行扫描识别，当识别出条码数据时通过onmarked回调函数返回。
   * @param options : BarcodeOptions 可选 条码识别的参数
   */
  qrCodeRestart(options) {
  }


  /**
   * 设置闪光灯的开或关
   * @param open :  boolean 必选;是否开启闪光灯;可取值true或false，true表示打开闪光灯，false表示关闭闪光灯。
   */
  qrCodeSetFlash(open) {
  }

  /**
   * 结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获。 结束后可调用start方法重新开始识别。
   */
  qrCodeCancel() {
  }

  /**
   * 释放控件占用系统资源，调用close方法后控件对象将不可使用。
   */
  qrCodeClose() {
  }


  //二维码：结束







  //back处理器:开始

  /**
   * back(locat)
   * back(key,locat,disableBackStack)
   * 可自定义返回策略的返回
   * @param key ? : string     可选；返回策略 backMap 中的key，会执行 backMap 中的相应的 conditionBack ；
   * @param locat ? : any     可选；在执行 conditionBack 时，给 conditionBack.back(locat) 函数传递的位置参数 ;
   * @param disableBackStack ? : boolean     可选；默认值 false; 表示是否禁用 BackStack ；如果该参数的值是 true ，表示：即使 key 对应的 conditionBack 不存在 或者 执行失败，也不会执行 backStack 中的 conditionBack ；
   * @returns boolean  表示是否执行成功
   *
   */
  back(key,locat,disableBackStack){
    if (typeof key == "number" && arguments.length == 1){
      locat = key;
      key = null;
    }
    return this.backScheme.back(locat,key,disableBackStack);
  }





  //back处理器:结束



  /**
   * 设置程序快捷方式上显示的提示数字
   * @param badgeNumber : number 提示的数字
   */
  setBadgeNumber(badgeNumber){

  }




  //打开URL：开始


  //webviwe的id映射表
  webIdMap = {};

  // app 的 id 映射表
  appIdMap = {};


  /**
   * 将 openURL(openOpt) 的入参 openOpt 转换为 规范的新的 openOpt ;
   * @param openOpt
   * @returns openOpt 规范的 openOpt
   * @private
   */
  _parseOpenURLOptions(openOpt){

    if (typeof openOpt == "object"){
      var parsedOpt = {...openOpt};
    } else {
        parsedOpt = {url:openOpt};
    }

    var {app,webview} = parsedOpt;


    if (typeof webview == "object") {
      var webId = webview.id;
    }else {
      webId = webview;
      webview = {};
    }

    if (webId) {
      webId = this.webIdMap[webId] || webId;
      webview.id = webId;
      parsedOpt.webview = webview ;
    }




    if (typeof app == "object") {
      var appId = app.id;
    }else {
      appId = app;
      app = {};
    }

    if (appId) {
      appId = this.appIdMap[appId] || appId;
      app.id = appId;
      parsedOpt.app = app ;
    }


    return parsedOpt;

  }







  /**
   * 在指定app中打开URL
   *
   * @param openOpt : {url:string,app ?:any,webview ?:any,method ?:string,callback ?:function}     打开的选项对象
   *
   * @property openOpt.url : string    需要被打开的url
   * @property openOpt.app : {id}   app的相应信息
   * @property openOpt.webview : {id,style}    webview的相应信息
   * @property openOpt.method ? : replace | reload     可选；打开url的方式
   * @property openOpt.callback ?: function   可选；回调函数
   */
  openURLOnApp(openOpt){
    return this.openURLOnWebview(openOpt);
  }





  /**
   * 在指定webview中打开URL
   *
   * @param openOpt : {url:string,webview ?:any,method ?:string,callback ?:function}     打开的选项对象
   *
   * @property openOpt.url : string    需要被打开的url
   * @property openOpt.webview : {id,style}    webview的相应信息
   * @property openOpt.method ? : replace | reload     可选；打开url的方式
   * @property openOpt.callback ?: function   可选；回调函数
   */
  openURLOnWebview(openOpt){

    var {url,webview = {},method,callback} = openOpt;
    var {id,style} = webview;

    var result = window.open(url,id,style,method);
    if (callback){
      callback(openOpt);
    }

    return result;


  }




  /**
   * 在当前webview中打开URL
   *
   * @param openOpt : {url:string,method ?:string,callback ?:function}     打开的选项对象
   *
   * @property openOpt.url : string    需要被打开的url
   * @property openOpt.method ? : replace | reload     可选；打开url的方式
   * @property openOpt.callback ?: function   可选；回调函数
   */
  openURLOnSelf(openOpt){

    var {url,method,callback} = openOpt;
    var result = null;

    switch (method){
      case "replace":{
        result = location.replace(url);
        break;
      }

      case "reload":{
        result = location.reload();
        break;
      }

      default:{
        result = location.assign(url);
      }
    }


    if (callback){
      callback(openOpt);
    }

    return result;


  }







  /**
   * 打开URL
   *
   * 接口1
   * @param openOpt : URL     需要被打开的URL；默认会用 openURLOnSelf 中打开
   *
   * 接口2
   * @param openOpt : {url:string,app ?:any,webview ?:any,method ?:string,callback ?:function}     打开的选项对象
   *
   * @property openOpt.url : string    需要被打开的url
   * @property openOpt.app : any | {id}   app的相应信息；如果设置该属性，则会用 openURLOnApp 方法打开；
   * @property openOpt.webview : any | {id,style}    webview的相应信息；如果设置该属性，则会用 openURLOnWebview 方法打开；
   * @property openOpt.method ? : replace | reload     可选；打开url的方式
   * @property openOpt.callback ?: function   可选；回调函数
   */
  openURL(openOpt){

    let parsedOpt = this._parseOpenURLOptions(openOpt);

    if ("app" in parsedOpt){
      return this.openURLOnApp(parsedOpt)
    } else if ("webview" in parsedOpt){

      return this.openURLOnWebview(parsedOpt)
    }else {
      return this.openURLOnSelf(parsedOpt);
    }

  }



  //打开URL：结束







//  版本：开始


  /**
   * 安装客户端
   *
   * @param options : Object    安装选项
   *
   * options 有如下属性
   * @property path : string 路径
   * @property success ? : function 成功的回调函数
   * @property fail ？ : function 失败的回市函数
   */
  installClient(options){
    let {path, success, fail,...otherOpts} = options;
    return false;
  }

//  版本：结束



//  下载：开始

  download(){

  }

//  下载：结束


}
