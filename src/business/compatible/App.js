import {default as Client,clientEventNameMap} from "./Client";

import {ConditionBack,augModeMap,WebviewBack,specialWebviewTypeID,webviewIDIsTypeID,Actions,Conditions,getAllTypeIDsByWebviewID} from ':libraries/ConditionBack/index.js'
import {redirectCA,goLocatUseRouterA,goLocatUseRouterOnBackWebviewA,isNeedQuitC} from ':tools/ConditionAction.js'

import {webviewEventBroadcast,dispenseEventSeries,dispenseEventSeriesInLaunch,configManuallyMatchURLForWebview} from ':tools/Webview.js' ;



export default class App extends Client {
  static osName = "app";

  static synTest(){

    let userAgent = navigator.userAgent;

    let contHtml5Plus = /Html5Plus/i.test(userAgent);

    let osRegExp = new RegExp(this.osName,"i");
    let contSelf = osRegExp.test(userAgent);

    if (contHtml5Plus && contSelf) {
      return true;
    } else if (window.plus) {
      return osRegExp.test(plus.os.name);
    }

    return false;
  }

  static asynTest(resolve, reject){
    document.byAddEventListener("plusready", () => {
      let osRegExp = new RegExp(this.osName,"i");
      if (osRegExp.test(plus.os.name)) {
        resolve();
      }
    });
  }




  scheme = "allprocess" ;   //客户的 Scheme



  /**
   * 是否要开启手动匹配 url
   *
   * 备注：
   * 由于 DCloud 的 bug 导致 wap2app 的 sitemap.json 配置无效；在该bug解决之前，需要代码处理
   */
  manuallyMatchURL = true ;   //是否要开启手动匹配 url




  constructor(...rest){
    super(...rest);
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
       * 如果 Locat 是有效数字，则会 跳过目标webviwe并继序返回 ；
       * 如果 Locat 不是有效数字，则会 在 backWebview 中用 router 导航 locat；
       */
      WXH5Pay: new WebviewBack({
        targetTypeID:"WXH5Pay",
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),

      /**
       * 如果 Locat 是有效数字，则会 跳过目标webviwe并继序返回 ；
       * 如果 Locat 不是有效数字，则会 在 backWebview 中用 router 导航 locat；
       */
      Alipay: new WebviewBack({
        targetTypeID:"Alipay",
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),




      /**
       * 该 webviewBack 不需要主动调用，client的back会自动调用；
       * 如果 没有溢出 History 栈，则正常返回；
       * 如果 溢出 History 栈，则关闭 OutPage；
       */
      OutPage: new WebviewBack({
        targetTypeID:"OutPage",
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.aboutBeyondHistory,
        action: Actions.createActionBeyondHistory(function actionForOver(backLocat, conditionResult, conditionBack){
          let targetWVO = conditionBack.targetWebviewObject;
          targetWVO.close();
        } ,function actionForLack(backLocat, conditionResult, conditionBack){
          let targetWVO = conditionBack.targetWebviewObject;

          targetWVO.canBack(function(e) {
            if (e.canBack) {
              targetWVO.back();
            } else {
              targetWVO.close();
            }
          });

        }),
        augMode: augModeMap.constant,
        augmenter: 0
      }),



      /**
       * 在 Launch 中进行返回
       */
      BackOnLaunch: new WebviewBack({
        targetTypeID:specialWebviewTypeID.CurrentWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.judgeLocatIsNumber,
        action: Actions.createJudgeLocatIsNumberAction(goLocatUseRouterOnBackWebviewA,Actions.jumpTargetAndContinue),
        augMode: augModeMap.constant,
        augmenter: 0
      }),



    };



    /**
     * 返回栈
     * @type Array<ConditionBack>
     * @private
     */
    this.backStack = [


      /**
       * 当 locat 是 不是 number 类型时，在 backWebview 中用 router 导航 locat
       */
      new WebviewBack({
        targetTypeID:specialWebviewTypeID.CurrentWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: Conditions.locatIsNotNumber,
        action: goLocatUseRouterOnBackWebviewA,
        augMode: augModeMap.constant,
        augmenter: 0
      }),


      /**
       * 在 LaunchWebview 中，当 router.isOnSpecialLocats 或者 history.length <= 1 时，退出应用
       */
      new WebviewBack({
        targetTypeID:specialWebviewTypeID.LaunchWebview,
        backTypeID:specialWebviewTypeID.LaunchWebview,
        condition: isNeedQuitC,
        action: Actions.quit,
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


    ];




  }




  _init() {

    this.ready.then((plus)=> {
      this._configEnv();
      this._addEventListener();
      this._closeSplashscreen();
      this._setWebView();
    });

  }


  /**
   * 配置环境
   * @private
   */
  _configEnv(){


    //配置App环境:开始

    /**
     * App环境是与多个 Webview 相关的环境，并不是仅仅当前 Webview 才会用到的环境
     */

    //分发事件系列
    if (!window.dispenseEventSeries) {
      window.dispenseEventSeries = dispenseEventSeries ;
    }


    //在 LaunchWebview 中分发事件系列
    if (!window.dispenseEventSeriesInLaunch) {
      window.dispenseEventSeriesInLaunch = dispenseEventSeriesInLaunch ;
    }


    //添加往所有webview中派发事件的方法
    if (!window.webviewEventBroadcast) {
      window.webviewEventBroadcast = webviewEventBroadcast ;
    }


    //配置App环境:结束








  }





  //版本：开始

  /**
   * version : 返回当前客户端的版本；
   * 计算属性，只读；
   */
  get version(){
    return plus.runtime.version;
  }





  /**
   * 安装客户端
   *
   * @param options : Object    安装选项
   *
   * options 有如下属性
   * filePath : string 路径
   * force: (Boolean 类型 )是否强制安装
   *    true表示强制安装，不进行版本号的校验；false则需要版本号校验，如果将要安装应用的版本号不高于现有应用的版本号则终止安装，并返回安装失败。 仅安装wgt和wgtu时生效，默认值 false。
   * success ? : function 成功的回调函数
   * fail ？ : function 失败的回市函数
   */
  installClient(options){
    let {filePath, success, fail,...otherOpts} = options;
    return plus.runtime.install(filePath, otherOpts, success, fail);
  }




  /**
   * 更新客户端
   * @param options : Object   更新选项
   *
   * options 可设置如下属性：
   * url: ( String ) 必选 要下载文件资源地址
   * method: (String 类型 )网络请求类型；支持http协议的“GET”、“POST”，默认为“GET”请求。
   * data: (String 类型 )POST请求时提交的数据；仅在网络请求类型method设置为"POST"时有效，"GET"请求时忽略此数据。
   * filename: (String 类型 )下载文件保存的路径；
   *    保存文件路径仅支持以"_downloads/"、"_doc/"、"_documents/"开头的字符串。 文件路径以文件后缀名结尾（如"_doc/download/a.doc"）表明指定保存文件目录及名称，以“/”结尾则认为指定保存文件的目录（此时程序自动生成文件名）。 如果指定的文件已经存在，则自动在文件名后面加"(i)"，其中i为数字，如果文件名称后面已经是此格式，则数字i递增，如"download(1).doc"。 默认保存目录为（"_downloads"），并自动生成文件名称。
   * priority: (Number 类型 )下载任务的优先级；数值类型，数值越大优先级越高，默认优先级值为0。
   * timeout: (Number 类型 )下载任务超时时间；数值类型，单位为s(秒)，默认值为120s。 超时时间为服务器响应请求的时间（不是下载任务完成的总时间），如果设置为0则表示永远不超时。
   * retry: (Number 类型 )下载任务重试次数；数值类型，默认为重试3次。
   * retryInterval: (Number 类型 )下载任务重试间隔时间；数值类型，单位为s(秒)，默认值为30s。
   */
  updateClient(options){

    shareInst.app.$vux.loading.show({
      text: "正在下载更新包"
    });

    options.completed = function (download,status) {
      shareInst.app.$vux.loading.hide();

      if ( status == 200 ) { // 下载成功
        shareInst.app.$vux.toast.text("下载成功");

        var filename = download.filename;

        var instOpts = {
          filePath:filename,
          success:function (widgetInfo) {

          },
          fail:function (error) {

          }
        };

        shareInst.client.installClient(instOpts);

      } else {//下载失败
        shareInst.app.$vux.toast.text("下载失败");
      }


    };

    shareInst.client.download(options);

  }




  //版本：结束






  //  下载：开始

  /**
   * 下载文件
   * @param options : Object   下载选项
   *
   * options 可设置如下属性：
   * url: ( String ) 必选 要下载文件资源地址
   * method: (String 类型 )网络请求类型；支持http协议的“GET”、“POST”，默认为“GET”请求。
   * data: (String 类型 )POST请求时提交的数据；仅在网络请求类型method设置为"POST"时有效，"GET"请求时忽略此数据。
   * filename: (String 类型 )下载文件保存的路径；
   *    保存文件路径仅支持以"_downloads/"、"_doc/"、"_documents/"开头的字符串。 文件路径以文件后缀名结尾（如"_doc/download/a.doc"）表明指定保存文件目录及名称，以“/”结尾则认为指定保存文件的目录（此时程序自动生成文件名）。 如果指定的文件已经存在，则自动在文件名后面加"(i)"，其中i为数字，如果文件名称后面已经是此格式，则数字i递增，如"download(1).doc"。 默认保存目录为（"_downloads"），并自动生成文件名称。
   * priority: (Number 类型 )下载任务的优先级；数值类型，数值越大优先级越高，默认优先级值为0。
   * timeout: (Number 类型 )下载任务超时时间；数值类型，单位为s(秒)，默认值为120s。 超时时间为服务器响应请求的时间（不是下载任务完成的总时间），如果设置为0则表示永远不超时。
   * retry: (Number 类型 )下载任务重试次数；数值类型，默认为重试3次。
   * retryInterval: (Number 类型 )下载任务重试间隔时间；数值类型，单位为s(秒)，默认值为30s。
   * completed: ( DownloadCompletedCallback ) 可选 下载任务完成回调函数
   *
   *
   * @returns Download
   */
  download(options){
    let {url, completed,...otherOpts} = options;
    let downloader = plus.downloader.createDownload(url, otherOpts, completed);
    downloader.start();
    return downloader;
  }

//  下载：结束






  /**
   * plus 是否准备完毕
   * @return {Promise|Promise<any>}
   */
  get ready() {
    if (!this._ready) {
      this._ready = new Promise((resolve, reject) => {
        if (window.plus && window.plus.isReady) {
          resolve(window.plus);
        } else {
          document.byAddEventListener("plusready", (event) => {
            resolve(window.plus);
          });
        }
      });
    }

    return this._ready;
  }




  //关闭启动界面
  _closeSplashscreen(){
    if (window.plus && window.plus.navigator.hasSplashscreen()) {
      window.plus.navigator.closeSplashscreen();
    }

  }


  /**
   * 添加事件监听
   * @private
   */
  _addEventListener(){

    //注册webview事件:开始

    /**
     * 注册 webview 事件；
     * 注释：webview 事件是仅仅当前 Webview 可能用到的事件；
     */
    document.byAddListenerForMultipleEvent(["pause","background","resume","foreground","trimmemory"], (event)=>{


      let clientEventName = null ;
      let data = null ;

      switch (event.type) {
        case "pause" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }

        case "background" :{
          clientEventName = clientEventNameMap.background ;
          break;
        }


        case "resume" :{
          clientEventName = clientEventNameMap.foreground ;
          data = plus.runtime.arguments ;
          break;
        }

        case "foreground" :{
          clientEventName = clientEventNameMap.foreground ;
          data = plus.runtime.arguments ;
          break;
        }

        case "trimmemory" :{
          clientEventName = clientEventNameMap.willQuit ;
          break;
        }

      }


      this.dispatchClientEvent(clientEventName,data) ;


    });


    let currWVO = plus.webview.currentWebview();

    currWVO.addEventListener("show", ()=> {
      console.log('----事件：App.js：show;' + JSON.stringify(currWVO) );

      this.dispatchClientEvent(clientEventNameMap.webShow,null) ;

    });

    currWVO.addEventListener( "close", (event)=>{
      console.log('----事件：App.js：close;' + JSON.stringify(currWVO) );
      this.dispatchClientEvent(clientEventNameMap.webClosed,null) ;
    });


    //注册webview事件:结束



    //手动匹配url：开始


    /**
     * 手动匹配 url
     * 备注：
     * 由于 DCloud 的 bug 导致 wap2app 的 sitemap.json 配置无效；在该bug解决之前，需要代码处理
     */
    let launchWVO = plus.webview.getLaunchWebview();
    if (this.manuallyMatchURL && launchWVO.id == currWVO.id){

      //本地 host 的验证正则
      let host = location.host;
      let hostRegStr = host.replace(/\./g,"\\.");
      let hostRex = new RegExp(hostRegStr);

      let configOptions = {

        //拦截Webview窗口URL请求的配置对象
        urlOptions:{
          effect:"instant",
          mode:"allow",
          match: "clientId="
        },

        // 排除的正则 或 正则的数组
        excludes:[hostRex,/wx\.tenpay\.com|mclient\.alipay\.com/i],

        //OutPage的Webview窗口样式（如窗口宽、高、位置等信息）
        webviewStyles:{
          backButtonAutoControl: "close",
          titleNView: {
            autoBackButton: true,
            backgroundColor: "#FFFFFF",
            titleColor: "#333333",
            titleSize: "﻿18px"
          }
        }
      };
      let notRemoveOverrideUrl = this.osName == "android";
      configManuallyMatchURLForWebview(configOptions,notRemoveOverrideUrl);


    }


    //手动匹配url：结束



    //注册App事件:开始

    /**
     * 注册 App 事件；
     * 注释：App事件是与多个 Webview 相关的事件，并不是仅仅当前 Webview 可能用到；
     */
    if  (!window.appEventIsRegistered){ //如果 App 事件还末注册，则注册 App 事件

      currWVO.addEventListener("show", function(event) {
        console.log('----事件：App:show:' + JSON.stringify(currWVO) );

        dispenseEventSeriesInLaunch("Broadcast", "displayChange", {
          webviewID: currWVO.id,
          action: "show"
        });

      });

      currWVO.addEventListener( "close", function(event){
        console.log('----事件：App:close:' + JSON.stringify(currWVO) );

        dispenseEventSeriesInLaunch("Broadcast", "displayChange", {
          webviewID: currWVO.id,
          action: "close"
        });
      });



      //监听返回事件：开始
      plus.key.addEventListener("backbutton", function (event) {
        console.log("---事件：App:backbutton");
        if (window.shareInst && window.shareInst.client) {
          window.shareInst.client.back();
        } else {
          currWVO.canBack(function (e) {
            if (e.canBack) {
              currWVO.back();
            } else {
              currWVO.close();
            }
          });
        }

      });

      //监听返回事件：结束




      window.appEventIsRegistered = true ;  //标识 App 事件已注册

      console.log("---App.js中的App事件已注册");
    }

    //注册App事件:结束


  }

  /**
   * 配置webview
   * @private
   */
  _setWebView() {
    let currentWV = plus.webview.currentWebview();

    //启动webview
    if (webviewIDIsTypeID(currentWV.id ,specialWebviewTypeID.LaunchWebview)) {
      currentWV.setStyle({
        'popGesture': 'none'
      });
    }


  }


  //二维码：开始

  /**
   * 通过图片扫描条码数据
   * @param path
   * @param filters
   *
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string   必选;  二维码条形码的code
   * succResult.type : 必选 ; 识别到的条码类型，是二维码还是条形码
   * succResult.typeId: ( Number ) 必选 识别到的条码类型id
   * succResult.code: ( String ) 必选 识别到的条码数据
   * succResult.file: ( String ) 可选 识别到的条码图片文件路径
   *
   * 失败的回调参数 error
   *
   */
  scanQRCodeFromImg({path, filters}) {

    return new Promise(function (resolve, reject) {
      plus.barcode.scan(path, function (typeId, code, file) {

        let qbrCodeInfo = shareData.qbrCode.getPropValueForId(typeId);
        let qbrCodeType = qbrCodeInfo && qbrCodeInfo.type;

        let result = {type: qbrCodeType, typeId, code, file};
      }, function (error) {
        reject(error);
      }, filters);
    });

  }


  /**
   * 热苗二维码或者条形码
   * @param scanOptions
   * scanOptions.id: string  必选 条码识别控件在Webview窗口的DOM节点的id值
   * 为了定义条码识别控件在Webview窗口中的位置，需要指定控件定位标签（div或objecct）的id号，系统将根据此id号来确定条码识别控件的大小及位置。
   *
   * scanOptions.styles: BarcodeStyles  可选 条码识别控件样式
   *
   * scanOptions.conserve: boolean  可选  是否保存成功扫描到的条码数据时的截图；
   * 如果设置为true则在成功扫描到条码数据时将图片保存，并通过onmarked回调函数的file参数返回保存文件的路径。默认值为false，不保存图片。
   *
   * scanOptions.filename: string  可选  保存成功扫描到的条码数据时的图片路径
   * 可通过此参数设置保存截图的路径或名称，如果设置图片文件名称则必须指定文件的后缀名（必须是.png），否则认为是指定目录，文件名称则自动生成。
   *
   * scanOptions.vibrate: boolean  可选  成功扫描到条码数据时是否需要震动提醒
   * 如果设置为true则在成功扫描到条码数据时震动设备，false则不震动。默认值为true。
   *
   * scanOptions.sound: sring 可选  成功扫描到条码数据时播放的提示音类型
   * 可取值： "none" - 不播放提示音； "default" - 播放默认提示音（5+引擎内置）。 默认值为"default"。
   *
   *
   * @return Promise
   * 成功回调参数 succResult
   * succResult.code : string   必选;  二维码条形码的code
   * succResult.type : 必选 ; 识别到的条码类型，是二维码还是条形码
   * succResult.typeId: ( Number ) 必选 识别到的条码类型id
   * succResult.code: ( String ) 必选 识别到的条码数据
   * succResult.file: ( String ) 可选 识别到的条码图片文件路径
   *
   * 失败的回调参数 error
   * error.code   错误编码
   * error.message  错误描述信息
   */
  scanQRCode(scanOptions) {
    let {id, styles, conserve, filename, vibrate, sound} = scanOptions;

    return new Promise((resolve, reject) => {
      let qrCode = this._creatQRCode(id, styles);
      qrCode.onmarked = function (typeId, code, file) {
        /*
        type : 识别到的条码类型，是二维码还是条形码
        typeId: ( Number ) 必选 识别到的条码类型id
        code: ( String ) 必选 识别到的条码数据
        file: ( String ) 可选 识别到的条码图片文件路径
        */

        let qbrCodeInfo = shareData.qbrCode.getPropValueForId(typeId);
        let qbrCodeType = qbrCodeInfo && qbrCodeInfo.type;

        let result = {type: qbrCodeType, typeId, code, file};
        resolve(result);
      }

      qrCode.onerror = function (error) {
        /*
        error.code; 			// 错误编码
        error.message;	// 错误描述信息
        */
        reject(error);
      }

      this.qrCodeRestart({conserve, filename, vibrate, sound});

    })

  }


  /**
   * 开始条码识别
   * 开始调用系统摄像头获取图片数据进行扫描识别，当识别出条码数据时通过onmarked回调函数返回。
   * @param options : BarcodeOptions 可选 条码识别的参数
   */
  qrCodeRestart(options) {
    if (this._qrCode) {
      let startOptions = options || this._qrCode.startOptions;
      this._qrCode.startOptions = startOptions;
      this._qrCode.setFlash(startOptions);
    }
  }


  /**
   * 设置闪光灯的开或关
   * @param open :  boolean 必选;是否开启闪光灯;可取值true或false，true表示打开闪光灯，false表示关闭闪光灯。
   */
  qrCodeSetFlash(open) {
    if (this._qrCode) {
      this._qrCode.setFlash(open);
    }
  }

  /**
   * 结束对摄像头获取图片数据进行条码识别操作，同时关闭摄像头的视频捕获。 结束后可调用start方法重新开始识别。
   */
  qrCodeCancel() {
    if (this._qrCode) {
      this._qrCode.cancel();
    }

  }

  /**
   * 释放控件占用系统资源，调用close方法后控件对象将不可使用。
   */
  qrCodeClose() {
    if (this._qrCode) {
      this._qrCode.close();
      this._qrCode = null;
    }
  }


  _creatQRCode(id, styles) {
    let qrCode = new plus.barcode.Barcode(id, null, styles);
    this._qrCode = qrCode;
    return qrCode;
  }


  //二维码：结束






  //支付：开始

  /**
   * 加载微信支付的页面
   * @param mwebUrl
   * @private
   */
  _weChatWebPayLaunchMwebUrl(mwebUrl){
    let wxH5PayReferer = this._WXH5PayReferer();

    let wxPayWV = plus.webview.create(mwebUrl,"WXH5Pay",{
      additionalHttpHeaders:{
        Referer: wxH5PayReferer
      },
      backButtonAutoControl:"close",
      // titleNView:{
      //   ...shareData.navBarStyles,
      //   autoBackButton:true
      // }
    } );

    wxPayWV.appendJsFile('_www/common.append.js');

    wxPayWV.show();

  }


  //微信支付的 Referer
  _WXH5PayReferer(){
    return location.href ;
  }




  //支付：结束







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

    let alipayWV = plus.webview.create(payPageURLStr,"Alipay",{
      backButtonAutoControl:"close",
      // titleNView:{
      //   ...shareData.navBarStyles,
      //   autoBackButton:true
      // }
    } );

    alipayWV.appendJsFile('_www/common.append.js');
    alipayWV.show();

    return {complete:true, info: "调用支付成功"};

  }



  //生活号支付兼容：结束








  //back处理器: 开始





  /**
   * 可自定义返回策略的返回
   * @param key ? : string     可选；返回策略 backMap 中的key，会执行 backMap 中的相应的 conditionBack ；
   * @param locat ? : any     可选；在执行 conditionBack 时，给 conditionBack.back(locat) 函数传递的位置参数 ;
   * @param disableBackStack ? : boolean     可选；默认值 false; 表示是否禁用 BackStack ；如果该参数的值是 true ，表示：即使 key 对应的 conditionBack 不存在 或者 执行失败，也不会执行 backStack 中的 conditionBack ；
   * @returns boolean  表示是否执行成功
   *
   * 注意：
   * - key 的默认值为当前 webview 的 typeID ; 可通过 this.autoBackWebviewIDs 指定可供作为 默认值的 typeID ; 可通过 this.autoBackExcludeWebviewIDs 指定不能作为默认值的 typeID ;
   */
  back(key,locat,disableBackStack){

    let backKey = key ;

    if (!backKey) {
      let currWV = window.plus && window.plus.webview.currentWebview() ;

      if (currWV) {

        let wvID = currWV.id ;
        let allTypeIDs = getAllTypeIDsByWebviewID(wvID);

        //去除 CurrentWebview 、 TopWebview 的干扰；因为无效 wvID 为何任，allTypeIDs 中一定包含 CurrentWebview ，当当前是 TopWebview 时，allTypeIDs 也一定包含 TopWebview ;
        let selfWebviewTypeIDs = [specialWebviewTypeID.CurrentWebview,specialWebviewTypeID.TopWebview];
        allTypeIDs = allTypeIDs.filter((item)=>{
          return !selfWebviewTypeIDs.includes(item);
        });

        let typeID = allTypeIDs[0] || wvID;

        let isInclu = this.autoBackWebviewIDs ? this.autoBackWebviewIDs.includes(typeID) : true ;
        let isExclu = this.autoBackExcludeWebviewIDs ? this.autoBackExcludeWebviewIDs.includes(typeID) : false ;

        if (isInclu && !isExclu) {
          backKey = typeID ;
        }

      }

    }


    return super.back(backKey,locat,disableBackStack);

  }




  //back处理器: 结束




  /**
   * 设置程序快捷方式上显示的提示数字
   * @param badgeNumber : number 提示的数字
   */
  setBadgeNumber(badgeNumber = 0){
    plus.runtime.setBadgeNumber( badgeNumber );
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
    var {url,app,callback} = openOpt;
    var id = app && app.id;
    return plus.runtime.openURL( url, callback, id );
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
    var {id,style,duration} = webview;

    return plus.webview.open( url, id, style, aniShow, duration, callback );
  }

  //打开URL：结束


}
