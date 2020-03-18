import WeChat from "./WeChat";



export default class WxMiniProgram extends WeChat {

  static  osName = "wxMiniProgram" ;

  static synTest(){
    let osTestReg = /miniprogram/i ;
    return osTestReg.test(navigator.userAgent) || osTestReg.test(window.__wxjs_environment) ;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener("WeixinJSBridgeReady",(event)=> {

      if (this.synTest()) {
        resolve();
      }else {
        reject();
      }

    });
  }


  showWebNavBar = true; //是否显示 web 导航条 ；

  payType = shareData.payMethodMap.weChatPublic.type;   //支付类型


  constructor() {
    super();
  }


  initProperty() {
    super.initProperty();


    /**
     * 追加的 backMap
     * @type {key:ConditionBack}
     * @private
     */
    this.appendBackMap = {

      /**
       * 如果 Locat 是有效数字，则执行正常的 ConditionBack 返回 ；
       * 如果 Locat 不是有效数字，则用 router 路由到指定位置；
       */
      WXH5Pay: new ConditionBack({
        condition: function isInOutPage(backLocat, conditionBack) {
          return shareData.launchParams.webviewID == "OutPage"
        },
        action: function miniProgramPageBack(backLocat, conditionResult, conditionBack) {
          shareInst.wx.miniProgram.navigateBack({
            delta: 1
          });
          return true;
        },
        augMode: augModeMap.constant,
        augmenter: 0
      }),

    };



    this.backStack = [
      /**
       * 注意：此操作用于 launchWebview 是作为主页面时
       * OutPage窗口的返回逻辑；
       * 如果 没有溢出 History 栈，则正常返回；
       * 如果 溢出 History 栈，则关闭 OutPage；
       */
      new ConditionBack({
        condition: function isInOutPage(backLocat, conditionBack) {
          return shareData.launchParams.webviewID == "OutPage"
        },
        action: function miniProgramPageBack(backLocat, conditionResult, conditionBack) {


          let hisLength = history.length;
          let overNum = backLocat + 1 - hisLength;
          let overflow = overNum > 0;

          if  (overflow){
            shareInst.wx.miniProgram.navigateBack({
              delta: overNum
            });
          } else {
            history.go(-backLocat);
          }


          return true;
        },
        augMode: augModeMap.constant,
        augmenter: 0
      }),


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
       * 注意：此操作用于 launchWebview 是作为主页面时
       * 做正常的返回或者路由导航
       * 此 conditionBack 一般放在最后
       */
      new ConditionBack({
        condition: Conditions.judgeLocatIsNumber,
        action:Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA),
        augMode: augModeMap.constant,
        augmenter: 0
      })



      /**
       * 注意：此操作用于 launchWebview 不是作为主页面时
       * 如果 没有溢出 History 栈，则正常返回；
       * 如果 溢出 History 栈，则关闭 当前window；
       */
      /*new ConditionBack({
        condition: Conditions.judgeLocatIsNumber,
        action:Actions.createJudgeLocatIsNumberAction(goLocatUseRouterA,function miniProgramPageBack(backLocat, conditionResult, conditionBack) {
          debugger
          let overNum = backLocat - history.currNavIndex;
          let overflow = overNum > 0;

          if  (overflow){
            shareInst.wx.miniProgram.navigateBack({
              delta: overNum
            });
          } else {
            history.go(-backLocat);
          }


          return true;
        }),
        augMode: augModeMap.constant,
        augmenter: 0
      })*/



    ];


  }




  //打开URL：开始


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

    var {url,webview={},method,callback} = openOpt
    var {id} = webview;

    if (method == "replace") {
      return this.openURLOnSelf(openOpt);
    }


    let param = {
      command:"webview",
      params:url
    };

    let queryString = param.toJSONqueryStringify(true);
    let webviewUrl = id + queryString;

    return shareInst.wx.miniProgram.navigateTo({
      url:webviewUrl,
      complete:callback
    });

  }


  /**
   * 导航到指定的webviwe页面
   * @param navOpts : {id,url,params,type = "push"}
   * @return {Promise<unknown>}
   */
  navigateToWebviewById(navOpts,webviewId,params){
    if (!navOpts.url && navOpts.id){
      var url = this.webIdMap[navOpts.id];
      navOpts = Object.assign({},navOpts,{url:url});
    }
    return this.navigateToWebview(navOpts);
  }

  /**
   * 导航到指定的webviwe页面
   * @param navOpts : {url,params,type = "push"}
   * @return {Promise<unknown>}
   */
  navigateToWebview(navOpts){
    var options = navOpts;
    if (typeof options == "string"){
      options = {url:navOpts};
    }
    var {url,params,type = "push"} = options;

    var webviewwUrl = url;
    if (params){
      var paramsStr = params.toJSONqueryStringify(true);
      webviewwUrl = url + paramsStr;
    }

    switch (type) {
      case "push":{
        var typeKey = "navigateTo";
        break;
      }
      case "replace":{
        typeKey = "redirectTo";
        break;
      }
    }


    return new Promise((resolve, reject)=>{
      if  (typeKey){
        shareInst.wx.miniProgram.navigateTo({
          url: webviewwUrl,
          success: function (res) {
            resolve(res);
          },
          fail: function (error) {
            reject(error);
          }
        });
      }else {
        reject(`没有与${type}对应的导航`);
      }
    });
  }

  //打开URL：结束



}
