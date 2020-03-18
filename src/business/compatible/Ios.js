import App from './App'

import CmdURL from ':tools/CommandURL.js'


import {augModeMap,WebviewBack,specialWebviewTypeID,webviewIDIsTypeID,Actions,Conditions} from ':libraries/ConditionBack/index.js'
import {redirectCA,goLocatUseRouterA,goLocatUseRouterOnBackWebviewA,isNeedQuitC} from ':tools/ConditionAction.js'



export default class Ios extends App {
  static osName = "ios";


  scheme = window.location.hostname ;   //客户的 Scheme



  /*
该方法用于创建被父类依赖的属性（简称：父类依赖属性） ；

注意：
- 子类需要在该方法中首先向上调用该方法 `super.initProperty()`；
- 最顶层类的该方法不需要向上调用 ;
- 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

*/

  initProperty() {
    super.initProperty();


    /**
     * 当应用从后台切换到前台时，需要关闭的 WebviewTypeID
     * @type [WebviewTypeID]
     */
    this.closedWebviewTypeIDsSwitchToForeground = ["WXH5Pay","Alipay"];




    /**
     * 当应用从后台切换到前端时，关闭的顶层指定的 Webview
     * @type {WebviewBack}
     */
    this.appendBackMap.closedSwitchToForeground = new WebviewBack({
      targetTypeID: specialWebviewTypeID.TopWebview,
      comparedTypeIDs: this.closedWebviewTypeIDsSwitchToForeground,
      backTypeID: specialWebviewTypeID.LaunchWebview,
      condition: Conditions.judgeLocatIsNumber,
      action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA, Actions.jumpTargetAndContinue),
      augMode: augModeMap.constant,
      augmenter: 0
    });


  }




  //支付：开始


  /**
   * 当前支付操作完成后跳转的位置
   * @returns string | RouteLocation 支付流程结束后跳转的位置，可以是完整的url字符串，或者 router 的位置对象；
   */

  currentPayNextLocat = null;



  /**
   * 把 位置对象 loca 转成微信的回调地址
   * @param loca : Location   位置对象
   * @return string   微信的回调地址
   * @private
   *
   *
   * 注意：
   * 在IOS的包壳应用中使用微信的h5支付调起微信App支付完成后，点击身份的 完成 触发返回时，会在浏览器中调整 url ，
   * 解决方案是： 把回调 URL 的 scheme 设置为 本App 的 scheme ，这些在相应的客户的兼容模块里做，所以 ios 需要重载此方法
   *
   */
  _weChatRedirectUrlForLocat(loca){

    this.currentPayNextLocat = loca;

    let cmdData = super._weChatRedirectUrlForLocat(loca) ;


    let redirectUrl = CmdURL.urlStringify({
      protocol: this.scheme ,
      namespaces : window.location.hostname ,
      command : "url" ,
      params : {
        data : cmdData
      }
    }) ;

    console.log("---redirectUrl:" + redirectUrl);

    return redirectUrl ;
  }



  //微信支付的 Referer
  _WXH5PayReferer(){
    return `${this.scheme}://` ;
  }





  //支付：结束




  //事件：开始

  /**
   * 应用进入前台的处理器
   */
  foregroundHandle(data){

    let currentPayNextLocat = this.currentPayNextLocat;
    if (currentPayNextLocat) {
      var status = this.back("closedSwitchToForeground",currentPayNextLocat,true);
      this.currentPayNextLocat = null;
    }


    if (!status) {
      super.foregroundHandle(data);
    }



  }



  //事件：结束




//  版本：开始


  /**
   * 安装客户端
   *
   * @param options : Object    安装选项
   *
   * options 有如下属性
   * filePath : string 路径； AppStore 中 应用的路径格式为 : itms-apps://itunes.apple.com/cn/app/idxxx      其中xxx指的是你的APPID
   * force: (Boolean 类型 )是否强制安装
   *    true表示强制安装，不进行版本号的校验；false则需要版本号校验，如果将要安装应用的版本号不高于现有应用的版本号则终止安装，并返回安装失败。 仅安装wgt和wgtu时生效，默认值 false。
   * success ? : function 成功的回调函数
   * fail ？ : function 失败的回市函数
   */
  installClient(options){
    let {filePath, success, fail,...otherOpts} = options;
    plus.runtime.openURL(filePath);
  }







  /**
   * 更新客户端
   * @param options : Object   更新选项
   *
   * options 可设置如下属性：
   * url: ( String ) 必选 要下载文件资源地址
   */
  updateClient(options){
    this.installClient({filePath:options.url})
  }

//  版本：结束




}
