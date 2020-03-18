import axios from 'axios'
import {NamedDoneCountManager} from './DoneCountManager'

/**
 * loadingDoneAgain 和 requestDoneAgain 配置对象 代理 DoneCountManager 属性列表
 */
const _doneAgainProxyProps = ["urlAsDoneCountName","conflictPolicy","autoIncrTotalIfRepeat","autoDeleteTarget","autoDeleteMode","clearDelay"];

export class HttpRequest {
  /**
   * 创建HTTP请求对象
   * @param httpConfig : Object  HTTP的配置对象，
   *
   * httpConfig 中可配置的字段如下：
   *
   * baseURL : string    基URL
   * method  : string    默认的请求方式
   * publicData : Object | (reqOptions)=>Object  公共的参数 或者是 用来获取公共参数的函数，会对所有请求都追加些参数
   * reqTransforms : [(ReqOptions)=>ReqOptions]  转换请求选项的转换函数数组，用于对reqOptions进行转换，也可以在函数里给数据添加一些公共的参数
   * resTransforms : [(Response,ReqOptions)=>Response]  转换响应的转换函数数组，用于对 response 进行转换；
   * headers  : Object    默认的请求头对象
   * reqOptions.responseType : string         表明服务器返回的数据类型，如：'json','text' 等等
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * mainDataGet  : (responseData:any)=>mainData:any    如果 mainData 设置为 true，当请求成功时，会返回被 mainDataGet 处理过的数据；
   * successPrompt : boolean    是否启用全局的成功提示；
   * promptHandle : (info:data | error,success:boolean)=>Void    请求成功或者失败的回调函数
   * failPrompt  : boolean    是启用用全局的失败提示;
   * showLoading  : boolean    是否启用加载状态指示；默认值为 true
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * startLoadingHandle : (loadText:string,reqOptions:ReqOptions,{showCount:number,globalShowCount:number,doneCount:DoneCount,doneCountManager:DoneCountManager,http:HttpRequest})=>showCountIncrStep : number | undefined  开始显示 loading 的回调函数；返回 加载状态指示显示计数 loadingShowCount 的 增加量；
   * endLoadingHandle  : (succeed,reqOptions:ReqOptions,resData:ResponseData,{showCount:number,globalShowCount:number,doneCount:DoneCount,doneCountOnFail:DoneCount,doneCountManager:DoneCountManager,http:HttpRequest})=>showCountDecrStep : number | undefined   结束显示 loading 的回调函数；返回 加载状态指示显示计数 loadingShowCount 的 减少量；
   *
   * startRequestHandle : (reqOptions,addInfo:RequestHandleAddInfo)=>Void     请求开始的回调函数
   * endRequestHandle :  (succeed,reqOptions:ReqOptions,resData:ResponseData,addInfo:RequestHandleAddInfo)=>Void    请求结束的回调函数；
   *
   *
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependentPro : Promise 请求的依赖项，当请求有依赖时，请求会 等到 dependentPro 解决之后触发
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   *
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   *
   *
   * addInfoInRes ?: boolean    可选；默认值：false；是否在响应数据中添加额外的信息； 当值为 true 时，会在失败 或 成功时返回一个数组，数据的中第1个元素就是请求真正的响应数据 或 错误信息，第2个元素是这种格式的对象 : {doneCount:DoneCount,doneCountManager:DoneCountManager,http:HttpRequest}
   * doneAgain ?: HttpDoneAgainOptions    可选；完成计数的配置对象；如果 loadingDoneAgain 或 requestDoneAgain 未配置，则会采用 doneAgain；
   * loadingDoneAgain ?: HttpDoneAgainOptions   可选；loading完成计数的配置对象；如果 loadingDoneAgain  未配置，则会采用 doneAgain；
   * requestDoneAgain ?: HttpDoneAgainOptions   可选；request完成计数的配置对象；如果 requestDoneAgain  未配置，则会采用 doneAgain；
   *
   * doneAgain.urlAsDoneCountName ?: boolean  可选；默认值：false； 当 DoneCount 选项中没有设置 namesOrNum 、 names 、 doneNum 选项时，是否将 urlPath 的值 作为 names 选项的值；
   *
   *
   *
   *
   * # 类型定义
   *
   * RequestHandleAddInfo = {
        loadText:string,showCount:number,globalShowCount:number,,
        loadingDoneAgain,loadingDoneCount:DoneCount,loadingDoneCountOnFail:DoneCount,loadingDoneCountManager:DoneCountManager,
        requestDoneAgain,requestDoneCount:DoneCount,requestDoneCountOnFail:DoneCount,requestDoneCountManager:DoneCountManager,
        http:HttpRequest}
   *
   *
   *
   * HttpDoneAgainOptions = {
   *    urlAsDoneCountName:boolean,
   *    conflictPolicy:ConflictPolicy,
   *    autoIncrTotalIfRepeat:boolean,
   *    autoDeleteTarget:AutoDeleteTarget
   *    autoDeleteMode:AutoDeleteMode,
   *    clearDelay:number,
   *    failDoneAgain: Names | DoneNum | HttpDoneAgainOptions,    可选；当请求失败时附加应用的 完成计数的配置对象，注意：本次请求配置的 完成计数配置对象 也会被应用；
   *    ...DoneCountProps}
   *
   * ConflictPolicy = "Add" | "Reset" | "Recreate" | "Update"
   * AutoDeleteTarget = "ForcedDone" | "RealDone" | "Done"
   * AutoDeleteMode = "Delay" | "Immediately" | "No"
   */
  constructor({reqTransforms, publicData, resTransforms, mainData, mainDataGet, validateHttpStatus, validateDataStatus, successPrompt, failPrompt, promptHandle, showLoading = true,loadingDelay=0, loadText, startLoadingHandle, endLoadingHandle, dependent, dependentPro, dependResultHandle,addInfoInRes,doneAgain,loadingDoneAgain,requestDoneAgain,startRequestHandle,endRequestHandle, ...otherConfig}) {

    let defaultConfig = {...otherConfig};

    if (validateHttpStatus) {
      defaultConfig.validateStatus = validateHttpStatus;
    }

    let responseType = defaultConfig.findValueForKeyFormats("responseType", this.propFormats);
    if (responseType) {
      defaultConfig.responsetype = responseType;
    }

    this.axios = axios.create(defaultConfig);


    this.publicData = publicData;
    this.reqTransforms = reqTransforms;
    this.resTransforms = resTransforms;
    this.mainDataGet = mainDataGet;
    this.successPrompt = successPrompt;
    this.failPrompt = failPrompt;
    this.mainData = mainData;

    this.showLoading = showLoading;
    this.loadingDelay = loadingDelay;
    this.loadText = loadText;
    this.startLoadingHandle = startLoadingHandle;
    this.endLoadingHandle = endLoadingHandle;
    this.promptHandle = promptHandle;

    this.startRequestHandle = startRequestHandle;
    this.endRequestHandle = endRequestHandle;


    this.dependent = dependent;
    this.dependentPro = dependentPro;
    this.dependResultHandle = dependResultHandle;

    this.validateDataStatus = validateDataStatus;
    this.addInfoInRes = addInfoInRes;

    this.loadingDoneAgain = loadingDoneAgain || doneAgain;
    this.requestDoneAgain = requestDoneAgain || doneAgain;

  }


  //显示计数：开始

  /**
   * 全局的 加载状态指示的显示计数
   */
  static loadingShowCount = 0;


  /**
   * 将 全局的 加载状态指示的显示计数 loadingShowCount 增加 step
   * @param step ? : number 默认值:1; 增加的数量；
   * @returns number 增加后的 显示计数 loadingShowCount 值
   */
  static incrLoadingShowCount(step){
    step = step == undefined ? 1 : step;
    return this.loadingShowCount += step;
  }

  /**
   * 将 全局的 加载状态指示的显示计数 loadingShowCount 减少 step
   * @param step ? : number 默认值:1; 减少的数量；
   * @returns number 减少后的 显示计数 loadingShowCount 值
   */
  static decrLoadingShowCount(step){
    step = step == undefined ? 1 : step;
    return this.loadingShowCount -= step;
  }



  /**
   * 加载状态指示的显示计数
   */
  loadingShowCount = 0;

  /**
   * 将 加载状态指示的显示计数 loadingShowCount 增加 step
   * @param step ? : number 默认值:1; 增加的数量；
   * @returns number 增加后的 显示计数 loadingShowCount 值
   */
  incrLoadingShowCount(step){
    step = step == undefined ? 1 : step;
    this.constructor.incrLoadingShowCount(step);
    return this.loadingShowCount += step;
  }

  /**
   * 将 加载状态指示的显示计数 loadingShowCount 减少 step
   * @param step ? : number 默认值:1; 减少的数量；
   * @returns number 减少后的 显示计数 loadingShowCount 值
   */
  decrLoadingShowCount(step){
    step = step == undefined ? 1 : step;
    this.constructor.decrLoadingShowCount(step);
    return this.loadingShowCount -= step;
  }


  //显示计数：结束




  //完成计数：开始



  /**
   * 同时 设置 全局默认的 requestDoneAgain 和 requestDoneAgain 配置
   */
  static set doneAgain(newValue){
    this.loadingDoneAgain = newValue;
    this.requestDoneAgain = newValue;
  }

  /**
   * 同时 设置 默认的 requestDoneAgain 和 requestDoneAgain 配置
   */
  set doneAgain(newValue){
    this.loadingDoneAgain = newValue;
    this.requestDoneAgain = newValue;
  }

  //loading完成计数：开始

  static get loadingDoneCountManager(){
    if (!this._loadingDoneCountManager) {
      let doneCountManager = new NamedDoneCountManager();
      doneCountManager.urlAsDoneCountName = true;
      this._loadingDoneCountManager = doneCountManager;
    }

    return this._loadingDoneCountManager
  }

  get loadingDoneCountManager(){
    if (!this._loadingDoneCountManager) {
      let doneCountManager = new NamedDoneCountManager();
      doneCountManager.urlAsDoneCountName = true;
      this._loadingDoneCountManager = doneCountManager;
    }

    return this._loadingDoneCountManager
  }


  /**
   *
   * @param httpDoneAgainOpts : HttpDoneAgainOptions
   * @returns {*}
   */
  unsafeDoneAgain_Loading(httpDoneAgainOpts){
    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.loadingDoneCountManager.unsafeDoneAgain(httpDoneAgainOpts);
    }else {
      return  this.loadingDoneCountManager.unsafeDoneAgain(httpDoneAgainOpts);
    }

  }


  doneAgain_Loading(httpDoneAgainOpts){

    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.loadingDoneCountManager.doneAgain(httpDoneAgainOpts);
    }else {
      return  this.loadingDoneCountManager.doneAgain(httpDoneAgainOpts);
    }


  }

  /**
   *
   * @param httpDoneAgainOpts : HttpDoneAgainOptions
   * HttpDoneAgainOptions = {...DoneAgainOptions,global:boolean}
   * @returns {*}
   */
  registerDoneCount_Loading(httpDoneAgainOpts){

    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.loadingDoneCountManager.register(httpDoneAgainOpts);
    }else {
      return  this.loadingDoneCountManager.register(httpDoneAgainOpts);
    }

  }


  /**
   * 设置 和 获取 全局默认的 loadingDoneAgain 配置
   */
  static get loadingDoneAgain(){
    return Object.defineProxyProperties({},this.loadingDoneCountManager,_doneAgainProxyProps);
  }

  static set loadingDoneAgain(newValue){
    if  (newValue){
      Object.assign(this.loadingDoneCountManager,newValue);
    }
  }

  /**
   * 设置 和 获取 默认的 loadingDoneAgain 配置
   */
  get loadingDoneAgain(){
    return Object.defineProxyProperties({},this.loadingDoneCountManager,_doneAgainProxyProps);
  }

  set loadingDoneAgain(newValue){
    if  (newValue){
      Object.assign(this.loadingDoneCountManager,newValue);
    }
  }


  //loading完成计数：结束






  //request完成计数：开始

  static get requestDoneCountManager(){
    if (!this._requestDoneCountManager) {
      let doneCountManager = new NamedDoneCountManager();
      doneCountManager.urlAsDoneCountName = true;
      this._requestDoneCountManager = doneCountManager;
    }

    return this._requestDoneCountManager
  }

  get requestDoneCountManager(){
    if (!this._requestDoneCountManager) {
      let doneCountManager = new NamedDoneCountManager();
      doneCountManager.urlAsDoneCountName = true;
      this._requestDoneCountManager = doneCountManager;
    }

    return this._requestDoneCountManager
  }




  unsafeDoneAgain_Request(httpDoneAgainOpts){

    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.requestDoneCountManager.unsafeDoneAgain(httpDoneAgainOpts);
    }else {
      return  this.requestDoneCountManager.unsafeDoneAgain(httpDoneAgainOpts);
    }
  }


  doneAgain_Request(httpDoneAgainOpts){

    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.requestDoneCountManager.doneAgain(httpDoneAgainOpts);
    }else {
      return  this.requestDoneCountManager.doneAgain(httpDoneAgainOpts);
    }

  }

  registerDoneCount_Request(httpDoneAgainOpts){

    let key = httpDoneAgainOpts && httpDoneAgainOpts.key;
    if (key == undefined){
      return;
    }

    if  (httpDoneAgainOpts.global){
      return this.constructor.requestDoneCountManager.register(httpDoneAgainOpts);
    }else {
      return  this.requestDoneCountManager.register(httpDoneAgainOpts);
    }

  }


  /**
   * 设置 和 获取 全局默认的 requestDoneAgain 配置
   */
  static get requestDoneAgain(){
    return Object.defineProxyProperties({},this.requestDoneCountManager,_doneAgainProxyProps);
  }

  static set requestDoneAgain(newValue){
    if  (newValue){
      Object.assign(this.requestDoneCountManager,newValue);
    }
  }


  /**
   * 设置 和 获取 默认的 requestDoneAgain 配置
   */
  get requestDoneAgain(){
    return Object.defineProxyProperties({},this.requestDoneCountManager,_doneAgainProxyProps);
  }

  set requestDoneAgain(newValue){
    if  (newValue){
      Object.assign(this.requestDoneCountManager,newValue);
    }
  }



  //request完成计数：结束


  //完成计数：结束










  /**
   * 属性的格式列表
   */
  propFormats = [{caseType: "N"}, {caseType: "L"}, {caseType: "U"}, {separator: "-", caseType: "L"}, {
    separator: "-",
    caseType: "U"
  }, {separator: "-", caseType: "N"}];


  /**
   * 有请求体的请求方式列表
   * @type {string[]}
   */
  haveHttpBodyMethods = ["post"];


  set reqTransforms(newValue) {

    if (newValue && !Array.isArray(newValue)) {
      newValue = [newValue];
    }
    this._reqTransforms = newValue;
  }

  get reqTransforms() {
    if (!this._reqTransforms) {
      this._reqTransforms = [];
    }

    return this._reqTransforms;
  }


  set resTransforms(newValue) {

    if (newValue && !Array.isArray(newValue)) {
      newValue = [newValue];
    }
    this._resTransforms = newValue;
  }

  get resTransforms() {
    if (!this._resTransforms) {
      this._resTransforms = [];
    }

    return this._resTransforms;
  }


  /**
   * 计算属性 validateHttpStatus
   * set : newValue ?: Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   */
  set validateHttpStatus(newValue) {
    let valHttpStatus = newValue;
    if (Array.isArray(newValue)){
      valHttpStatus = function (status) {
        return newValue.includes(status);
      };
    } else if (typeof newValue != "function"){
      valHttpStatus = function (status) {
        return newValue == status;
      };
    }
    this.axios.defaults.validateStatus = valHttpStatus
  }

  get validateHttpStatus() {
    return this.axios.defaults.validateStatus;
  }


  // dependentPro 请求依赖的 Promise
  set dependentPro(newValue) {
    if (this._dependentResolve) {
      this._dependentResolve(newValue);
    }

    this._dependentPro = newValue;
  }

  get dependentPro() {
    if (!this._dependentPro) {
      this._dependentPro = new Promise((resolve, reject) => {
        this._dependentResolve = resolve;
      });
    }

    return this._dependentPro;
  }


  /**
   * 请求头的配置对象 headers
   * headers 可配置如下选项：
   * headers.common : Object    配置所有请求公共的请求头字段
   * headers.get : Object    配置 get 请求的请求头字段
   * headers.put : Object    配置 put 请求的请求头字段
   * headers.post : Object    配置 post 请求的请求头字段
   * headers.patch : Object    配置 patch 请求的请求头字段
   * headers.head : Object    配置 head 请求的请求头字段
   * headers.delete : Object    配置 delete 请求的请求头字段
   */
  set headers(newValue) {

    if (newValue) {
      Object.keys(newValue).forEach((headerKey) => {
        Object.assign(this.axios.defaults.headers[headerKey], newValue[headerKey]);
      })
    }

  }


  get headers() {
    return this.axios.defaults.headers;
  }


  /**
   * 设置 headers
   * @param key : string    headers的键
   * @param value : string   值
   * @param methods ? : Method | [Method]   默认值：common，表示对所有的请求方式都有效； key 和 value 被应用到的请求方式的列表；
   */
  setHeaders(key, value, methods = "common") {
    let headers = this.axios.defaults.headers;

    if (!Array.isArray(methods)) {
      methods = [methods];
    }

    methods.forEach(function (method) {

      method = method.toLowerCase();
      let methodHeader = headers[method];
      if (!methodHeader) {
        methodHeader = {};
      }

      methodHeader[key] = value;
      headers[method] = methodHeader;

    });


    this.axios.defaults.headers = headers;
  }


  /**
   * 获取 相应请求方式的 headers
   * @param method ? : Method   默认值：common，表示获取通用的头；
   */
  getHeaders(method) {
    var headers = this.axios.defaults.headers;

    var commonHeader = headers["common"];
    if (method) {
      method = method.toLowerCase();
      var methodHeader = headers[method];

    }

    if (commonHeader || methodHeader) {
      var finalHeader = {...commonHeader, ...methodHeader};
    }

    return finalHeader;
  }


  set mainDataGet(newValue) {
    this._mainDataGet = newValue;
  }

  get mainDataGet() {
    if (!this._mainDataGet) {
      this._mainDataGet = function (responseData) {
        return responseData;
      };
    }

    return this._mainDataGet;
  }


  set baseURL(newValue) {
    this.axios.defaults.baseURL = newValue
  }

  get baseURL() {
    return this.axios.defaults.baseURL;
  }


  set method(newValue) {
    this.axios.defaults.method = newValue;
  }

  get method() {
    return this.axios.defaults.method;
  }


  set authorization(newValue) {
    if (newValue) {
      if (typeof newValue == "object") {
        newValue = JSON.stringify(newValue);
      }
      this.setHeaders('Authorization', newValue);
    }
  }


  set contentType(newValue) {
    if (newValue) {
      this.setHeaders('Content-Type', newValue, "post");
    }
  }


  /**
   * 添加公共参数
   * @param reqOptions : ReqOptions
   * @returns ReqOptions
   */
  addPublicData(reqOptions) {
    //  公共参数
    let publicData = this.publicData;

    if  (typeof publicData == "function"){
      publicData = this.publicData(reqOptions);
    }

    if (publicData) {
      publicData = Object.assign({}, publicData);
    } else {
      return reqOptions;
    }

    let {params, data, method = this.method} = reqOptions;

    if (params) {
      params = {...publicData, ...params};
    }


    if (typeof data == "object") {

      if (data.constructor.name == "Object") {

        data = {...publicData, ...data};

      } else if (data instanceof FormData) {

        Object.keys(publicData).forEach(function (key) {
          data.set(key, publicData[key]);
        });

      }
    }

    if (!params && !data) {
      if (method && this.haveHttpBodyMethods.includes(method.toLowerCase())) {
        data = publicData;
      } else {
        params = publicData;
      }
    }

    if (params) {
      reqOptions.params = params;
    }

    if (data) {
      reqOptions.data = data;
    }

    return reqOptions;
  }



  /**
   * 合并 完成计数 DoneCount 相关的选项
   * @param reqOptions
   * @private
   */
  _mergeDoneAgainOptions(reqOptions){
    let mergeDCOptions = {};

    let doneAgain = reqOptions.doneAgain;
    var {urlPath,loadingDoneAgain = doneAgain,requestDoneAgain = doneAgain} = reqOptions;

    if (loadingDoneAgain){
      mergeDCOptions.loadingDoneAgain = this._perfectDoneAgainOptions(loadingDoneAgain,urlPath,true);
    }


    if (requestDoneAgain){
      mergeDCOptions.requestDoneAgain = this._perfectDoneAgainOptions(requestDoneAgain,urlPath);
    }

    return mergeDCOptions;
  }


  _perfectDoneAgainOptions(doneAgainOpts,urlPath,forLoading){

    if (typeof doneAgainOpts == "object") {
      var {failDoneAgain,...doneAgain} = doneAgainOpts;
    }else {
      doneAgain = {key:doneAgainOpts};
    }

    let {namesOrNum,names,doneNum,urlAsDoneCountName,...doneAgainOther} = doneAgain;

    if  (!urlAsDoneCountName){
      let defaultDoneAgain = doneAgain.global ? (forLoading ? this.constructor.loadingDoneAgain : this.constructor.requestDoneAgain ) : (forLoading ? this.loadingDoneAgain : this.requestDoneAgain);
      urlAsDoneCountName = defaultDoneAgain.urlAsDoneCountName;
    }

    if (urlAsDoneCountName && (namesOrNum || names || doneNum) == undefined) {
      doneAgain.names = urlPath;
    }

    if (failDoneAgain){

      let failDAType = typeof failDoneAgain;
      if (failDAType == "number" ){
        failDoneAgain = {doneNum:failDoneAgain};
      }else if (failDAType == "string" || Array.isArray(failDoneAgain)){
        failDoneAgain = {names:failDoneAgain};
      }

      failDoneAgain = Object.assign({},doneAgainOther,failDoneAgain);
      doneAgain.failDoneAgain = failDoneAgain;
    }

    return doneAgain;
  }





  /**
   * 发送请求
   * @param reqOptions : Object  请求的选项对象，
   *
   * reqOptions 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * method  : string    请求方式
   * data  : Object    请求的数据，这些数据将被放入请求体中
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * header | headers  : Object    请求头对象
   * responseType : string         表明服务器返回的数据类型，如：'json','text' 等等
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   *
   * addInfoInRes ?: boolean    可选；默认值：false；是否在响应数据中添加额外的信息； 当值为 true 时，会在失败 或 成功时返回一个数组，数据的中第1个元素就是请求真正的响应数据 或 错误信息，第2个元素是这种格式的对象 : {doneCount:DoneCount,doneCountManager:DoneCountManager,http:HttpRequest}
   * doneAgain ?: HttpDoneAgainOptions    可选；完成计数的配置对象；如果 loadingDoneAgain 或 requestDoneAgain 未配置，则会采用 doneAgain；
   * loadingDoneAgain ?: HttpDoneAgainOptions   可选；loading完成计数的配置对象；如果 loadingDoneAgain  未配置，则会采用 doneAgain；
   * requestDoneAgain ?: HttpDoneAgainOptions   可选；request完成计数的配置对象；如果 requestDoneAgain  未配置，则会采用 doneAgain；
   *
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  request(reqOptions) {

    let {dependent = this.dependent, dependResultHandle = this.dependResultHandle} = reqOptions;

    if (dependent) {
      return this.dependentPro.then((dependentResult) => {
        let depReqOptions = dependResultHandle && dependResultHandle(dependentResult, reqOptions);

        if (depReqOptions == false) {
          return Promise.reject("请求被依赖阻止！")
        } else {
          depReqOptions = depReqOptions || reqOptions;
          return this._request(depReqOptions)
        }

      });
    } else {
      return this._request(reqOptions)
    }

  }

  _request(reqOptions) {
    let addPublicOptions = this.addPublicData(reqOptions);

    reqOptions = this.reqTransforms.reduce(function (options, transform) {
      let newOptions = transform(options);
      return newOptions;
    }, addPublicOptions);

    var {urlPath, validateHttpStatus, validateDataStatus = this.validateDataStatus, successPrompt = this.successPrompt, failPrompt = this.failPrompt, mainData = this.mainData, showLoading = this.showLoading,loadingDelay=this.loadingDelay, loadText = this.loadText, dependent, dependResultHandle,doneAgain,loadingDoneAgain,requestDoneAgain,addInfoInRes=this.addInfoInRes, ...otherConfig} = reqOptions;

    let httpDoneAgainOptsMap = this._mergeDoneAgainOptions({urlPath,doneAgain,loadingDoneAgain,requestDoneAgain});
    loadingDoneAgain = httpDoneAgainOptsMap.loadingDoneAgain;
    requestDoneAgain = httpDoneAgainOptsMap.requestDoneAgain;

    var loadingDoneCount = this.registerDoneCount_Loading(loadingDoneAgain);
    var loadingDoneCountManager = (loadingDoneAgain && loadingDoneAgain.global) ? this.constructor.loadingDoneCountManager : this.loadingDoneCountManager;

    var requestDoneCount = this.registerDoneCount_Request(requestDoneAgain);
    var requestDoneCountManager = (requestDoneAgain && requestDoneAgain.global) ? this.constructor.requestDoneCountManager : this.requestDoneCountManager;


    let reqConfig = {
      url: urlPath,
      ...otherConfig
    };


    let header = reqOptions.findValueOfKeys(["header", "headers"]);
    if (header) {
      reqConfig.headers = header;
    }

    let responseType = reqOptions.findValueForKeyFormats("responseType", this.propFormats);
    if (responseType) {
      reqConfig.responsetype = responseType;
    }

    if (validateHttpStatus) {
      let valHttpStatus = validateHttpStatus;
      if (Array.isArray(validateHttpStatus)){
        valHttpStatus = function (status) {
          return validateHttpStatus.includes(status);
        };
      } else if (typeof validateHttpStatus != "function"){
        valHttpStatus = function (status) {
          return validateHttpStatus == status;
        };
      }
      reqConfig.validateStatus = valHttpStatus;
    }


    if (showLoading) {


      if  (this.startLoadingHandle){

        //mark:显示加载指示器
        var loadingIsStarted = false;

        var performStartLoadHandle = ()=>{
          loadingIsStarted = true;

          var step = this.startLoadingHandle(loadText, reqOptions,{showCount:this.loadingShowCount,globalShowCount:this.constructor.loadingShowCount,doneCount:loadingDoneCount,doneCountManager:loadingDoneCountManager,http:this});
          this.incrLoadingShowCount(step);
        };

        if (loadingDelay>0){
          var loadingTimeoutID = setTimeout(performStartLoadHandle,loadingDelay);
        } else{
          performStartLoadHandle();
        }


      }


    }

    this.startRequestHandle(reqOptions,{
      loadText,showCount:this.loadingShowCount,globalShowCount:this.constructor.loadingShowCount,
      loadingDoneAgain,loadingDoneCount,loadingDoneCountManager,
      requestDoneAgain,requestDoneCount,requestDoneCountManager,
      http:this});




    var completeHandle = (succeed,respData)=>{
      //doneAgain：开始
      loadingDoneCount = this.unsafeDoneAgain_Loading(loadingDoneAgain);
      requestDoneCount = this.unsafeDoneAgain_Request(requestDoneAgain);
      if (!succeed){
        var loadingDoneAgainOnFail = loadingDoneAgain && loadingDoneAgain.failDoneAgain;
        if (loadingDoneAgainOnFail) {
          var loadingDoneCountOnFail = this.doneAgain_Loading(loadingDoneAgainOnFail);
        }

        var requestDoneAgainOnFail = requestDoneAgain && requestDoneAgain.failDoneAgain;
        if (requestDoneAgainOnFail) {
          var requestDoneCountOnFail = this.doneAgain_Loading(requestDoneAgainOnFail);
        }

      }
      //doneAgain：结束

      //endLoadingHandle：开始
      if (showLoading) {
        loadingTimeoutID && clearTimeout(loadingTimeoutID);

        if (loadingIsStarted && this.endLoadingHandle) {
          //mark:关闭加载指示器
          var step = this.endLoadingHandle(succeed,reqOptions,respData,{showCount:this.loadingShowCount,globalShowCount:this.constructor.loadingShowCount,doneCount:loadingDoneCount,doneCountOnFail:loadingDoneCountOnFail,doneCountManager:loadingDoneCountManager,http:this});
          this.decrLoadingShowCount(step);
        }

      }

      //endLoadingHandle：结束


      //endRequestHandle：开始
      this.endRequestHandle(succeed,reqOptions,respData,{
        loadText,showCount:this.loadingShowCount,globalShowCount:this.constructor.loadingShowCount,
        loadingDoneAgain,loadingDoneCount,loadingDoneCountOnFail,loadingDoneCountManager,
        requestDoneAgain,requestDoneCount,requestDoneCountOnFail,requestDoneCountManager,
        http:this});
      //endRequestHandle：结束

    };



    let axiosPromise = this.axios.request(reqConfig);

    axiosPromise = axiosPromise.then((response) => {

      response = this.resTransforms.reduce(function (res, transform) {
        let newRes = transform(res, reqOptions);
        return newRes;
      }, response);

      let respData = response.data;


      if (validateDataStatus && !validateDataStatus(respData,reqOptions)) {
        throw respData
      }


      if (successPrompt && this.promptHandle) {
        // mark: 成功的弹窗提示
        this.promptHandle(respData, true);
      }


      if (mainData) {
        respData = this.mainDataGet(respData);
      }

      completeHandle(true,respData);

      if (addInfoInRes){
        respData = [respData,{doneCount:requestDoneCount,doneCountManager:requestDoneCountManager,http:this}];
      }

      return respData;


    }).catch((error) => {

      if (failPrompt && this.promptHandle) {
        //mark: 失败的弹窗提示
        this.promptHandle(error, false);
      }

      let throwData = error.response || error;

      completeHandle(false,throwData);

      if (addInfoInRes){
        throwData = [throwData,{doneCount:requestDoneCount,doneCountManager:requestDoneCountManager,http:this}];
      }

      throw throwData;

    });


    return axiosPromise

  }


  /**
   * 发送get请求
   * @param options : ReqOptions   get请求的选项对象;
   *
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  get(options) {
    options.method = "get";
    return this.request(options);
  }


  /**
   * 发送post请求
   * @param options : ReqOptions
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * data  : Object    请求的数据，这些数据将被放入请求体中
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * contentType  : string    请求头的'Content-Type'字段的值
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   *
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  post(options) {
    let {contentType, ...reqOptions} = options;

    if (contentType) {
      reqOptions.headers = {...reqOptions.headers, 'Content-Type': contentType};
    }

    reqOptions.method = "post";

    return this.request(reqOptions);
  }


  /**
   * 发送 put 请求
   * @param options : ReqOptions
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * data  : Object    请求的数据，这些数据将被放入请求体中
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * contentType  : string    请求头的'Content-Type'字段的值
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   *
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  put(options) {
    let {contentType, ...reqOptions} = options;

    if (contentType) {
      reqOptions.headers = {...reqOptions.headers, 'Content-Type': contentType};
    }

    reqOptions.method = "put";

    return this.request(reqOptions);
  }


  /**
   * 发送 patch 请求
   * @param options : ReqOptions
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * data  : Object    请求的数据，这些数据将被放入请求体中
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * contentType  : string    请求头的'Content-Type'字段的值
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   *
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  patch(options) {
    let {contentType, ...reqOptions} = options;

    if (contentType) {
      reqOptions.headers = {...reqOptions.headers, 'Content-Type': contentType};
    }

    reqOptions.method = "patch";

    return this.request(reqOptions);
  }


  /**
   * 发送 delete 请求
   * @param options : ReqOptions   get请求的选项对象;
   *
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  delete(options) {
    options.method = "delete";
    return this.request(options);
  }


  /**
   * 发送 head 请求
   * @param options : ReqOptions   get请求的选项对象;
   *
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  head(options) {
    options.method = "head";
    return this.request(options);
  }


  /**
   * 发送 options 请求
   * @param options : ReqOptions   get请求的选项对象;
   *
   *
   * options 中可配置的字段如下：
   *
   * urlPath : string    url路径
   * params  : Object    请求的参数，这些参数将会被序列化放入请求的URL后面
   * header | headers  : Object    请求头对象
   * successPrompt : boolean    是否启用全局的成功提示；
   * failPrompt  : boolean    是启用用全局的失败提示;
   * mainData  : boolean    当请求成功时，是否返回经过 mainDataGet 处理过的数据；
   * showLoading  : boolean    是否启用加载状态指示；
   * loadingDelay  : number    加载状态指示的延时显示时间，单位：毫秒；默认值：0
   * loadText  : string   加载的提示文本
   * dependent : boolean   设置请求是否依赖 dependentPro
   * dependResultHandle : (result,reqOptions)=> HandleResult : ReqOptions || boolean || null || undefined    依赖结果处理器，当请求有依赖时，在 依赖解决之后 请求解决之前 调用该处理器；
   * 注意：
   * - 当 HandleResult 为 false 时，会取消请求；
   * - 当 HandleResult 为 非假值时， 会使用 HandleResult 进行请求；
   * - 当 HandleResult 为 除 false 之外的假值时，会使用 原来的 reqOptions 进行请求；
   * validateHttpStatus ?: number | string | Array<status> | (status: number) => boolean    定义 有效的 http返回状态码，可以是有效状态码 或 有效状态码的数组，也可以是返回表示状态码是否有效的布尔值的函数，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * validateDataStatus ?: (responseData: any,reqOptions:ReqOptions) => boolean   定义 后台数据的返回的状态码的 的有效性，如果返回true（或者设置成null/undefined），promise将会resolve；其他的promise将reject。
   * @returns AxiosPromise    请求的 AxiosPromise 对象
   *
   */
  options(options) {
    options.method = "head";
    return this.request(options);
  }


}


export default HttpRequest;
