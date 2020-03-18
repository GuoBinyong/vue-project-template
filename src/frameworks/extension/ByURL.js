//ByURL：开始

/**
 * 该类是用于在不支持 URL 类型的环境下替代 URL 的；但该类的提供的功能和接口远丰富于 URL ，但并不完全包含于 URL ，所以，完全替换 URL
 */
class ByURL {

  deleUrlUtilsMap = {
    url:["origin","protocol","host","hostname","port","pathname","pathList","absPath"],
    origin:["protocol","host","hostname","port"],
    host:["hostname","port"],
    pathname:["pathList","absPath"],
    pathList:["pathname","absPath"],
    search:["searchParams","params"],
    searchParams:["search","params"],
    hash:["hashSearch","hashParams","hashUrlUtils","params"],
    hashSearch:["hashParams","params"],
    hashParams:["hashSearch","params"],
    hashUrlUtils:["hash","hashSearch","hashParams","params"],
    addSearchParams:["addSearch"],
    addHashParams:["addHashSearch"]
  };

  /**
   * paramsPropParse  : (value,key,queryString)=> value    可选；用于在解析 URL 时 url 的参数的值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 JSON 字符中串，则将其转为对象，不则，原样输出；
   */
  paramsPropParse;

  /**
   * paramsPropStringify : (value,key,params)=> string    可选；用于在序列化的对象参数时对参数的属性值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 对象类型，则将其转为JSON字符串，否则，正常序列化；
   */
  paramsPropStringify;

  /**
   *
   * @param initUrl : UrlUtils | string    必选；
   * @param paramsPropParse ? : (value,key,queryString)=> value    可选；用于在解析 URL 时 url 的参数的值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 JSON 字符中串，则将其转为对象，不则，原样输出；
   * @param paramsPropStringify ? : (value,key,params)=> string    可选；用于在序列化的对象参数时对参数的属性值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 对象类型，则将其转为JSON字符串，否则，正常序列化；
   */
  constructor(initUrl,paramsPropParse,paramsPropStringify){
    this.paramsPropParse = paramsPropParse;
    this.paramsPropStringify = paramsPropStringify;
    this.initUrl = initUrl;
  }

  /**
   * urlUtils 包含解析后的所有url组件的对象
   */
  set urlUtils(newValue){
      this._urlUtils = newValue;
  }

  get urlUtils(){
    if (!this._urlUtils) {
      this._urlUtils = {};
    }
    return this._urlUtils;
  }


  /**
   * 原始输入的 url
   * @param newValue
   */
  set initUrl(newValue){
    this._initUrl = newValue;
    if (newValue){
      var urlUtils = newValue;
      if (typeof newValue != "object"){
        urlUtils = parseUrl(newValue,this.paramsPropParse,this.paramsPropStringify);
      }
      this.urlUtils = urlUtils;
    }
  }

  get initUrl(){
    return this._initUrl;
  }



  get href(){
    return stringifyUrl(this.urlUtils,this.paramsPropStringify,this.paramsPropParse);
  }
  set href(newValue){
    this.initUrl = newValue;
  }


  get url(){
    return this.urlUtils.url;
  }
  set url(newValue){
    this._deleUrlUtilsFor("url");
    this.urlUtils.url = url;
  }



  get origin(){
    return this.urlUtils.origin;
  }
  set origin(newValue){
    this._deleUrlUtilsFor("origin");
    this.urlUtils.origin = origin;
  }


  get protocol(){
    return this.urlUtils.protocol;
  }
  set protocol(newValue){
    this._deleUrlUtilsFor("protocol");
    this.urlUtils.protocol = protocol;
  }



  get host(){
    return this.urlUtils.host;
  }
  set host(newValue){
    this._deleUrlUtilsFor("host");
    this.urlUtils.host = host;
  }



  get hostname(){
    return this.urlUtils.hostname;
  }
  set host(newValue){
    this._deleUrlUtilsFor("hostname");
    this.urlUtils.hostname = hostname;
  }



  get port(){
    return this.urlUtils.port;
  }
  set host(newValue){
    this._deleUrlUtilsFor("port");
    this.urlUtils.port = port;
  }


  get pathname(){
    return this.urlUtils.pathname;
  }
  set pathname(newValue){
    this._deleUrlUtilsFor("pathname");
    this.urlUtils.pathname = pathname;
  }



  get pathList(){
    return this.urlUtils.pathList;
  }
  set pathList(newValue){
    this._deleUrlUtilsFor("pathList");
    this.urlUtils.pathList = pathList;
  }


  get absPath(){
    return this.urlUtils.absPath;
  }



  get search(){
    return this.urlUtils.search;
  }
  set search(newValue){
    this._deleUrlUtilsFor("search");
    this.urlUtils.search = search;
  }



  get searchParams(){
    return this.urlUtils.search;
  }
  set searchParams(newValue){
    this._deleUrlUtilsFor("searchParams");
    this.urlUtils.searchParams = searchParams;
  }



  get hash(){
    return this.urlUtils.hash;
  }
  set hash(newValue){
    this._deleUrlUtilsFor("hash");
    this.urlUtils.hash = hash;
  }



  get hashSearch(){
    return this.urlUtils.hashSearch;
  }
  set hashSearch(newValue){
    this._deleUrlUtilsFor("hashSearch");
    this.urlUtils.hashSearch = hashSearch;
  }



  get hashParams(){
    return this.urlUtils.hashParams;
  }
  set hashParams(newValue){
    this._deleUrlUtilsFor("hashParams");
    this.urlUtils.hashParams = hashParams;
  }


  get hashUrlUtils(){
    return this.urlUtils.hashUrlUtils;
  }
  set hashUrlUtils(newValue){
    this._deleUrlUtilsFor("hashUrlUtils");
    this.urlUtils.hashUrlUtils = hashUrlUtils;
  }


  get params(){
    return this.urlUtils.params;
  }


  /**
   * 清除与 util 相关的子 util
   * @param util : string
   */
  _deleUrlUtilsFor(util){
    let deleUtils = this.deleUrlUtilsMap[util];
    if (deleUtils){
      deleUtils.forEach((deleKey)=>{
        this.urlUtils[deleKey] = undefined;
      });
    }
  }


  /**
   * 接口1:
   * addSearchParams(key,value)
   * 给查询参数添加新的成员，并返回添加后的查询参数对象
   * @param key : string   添加的key
   * @param value : any    添加的值
   * @returns addSearchParams : Object    返回添加后的查询参数对象
   *
   *
   * 接口2:
   * 追加查询参数params，并返回追加后的查询参数对象
   * addSearchParams(params)
   * @param params : Object   添加的params对象
   * @returns addSearchParams : Object    返回添加后的查询参数对象
   *
   *
   * 接口3:
   * addSearchParams()
   * 获取添加的查询参数
   * @returns addSearchParams : Object    返回添加后的查询参数对象
   */
  addSearchParams(key,value){

    if (key){

      let addSearchParams = this.urlUtils.addSearchParams || {};
      if (typeof key == "object"){
        Object.assign(addSearchParams,key);
      } else {
        addSearchParams[key] = value;
      }
      this._deleUrlUtilsFor("addSearchParams");
      this.urlUtils.addSearchParams = addSearchParams;

    }

    return this.urlUtils.addSearchParams;
  }







  /**
   * 接口1:
   * addHashParams(key,value)
   * 给hash查询参数添加新的成员，并返回添加后的hash查询参数对象
   * @param key : string   添加的key
   * @param value : any    添加的值
   * @returns addSearchParams : Object    返回添加后的查询参数对象
   *
   *
   * 接口2:
   * addHashParams(params)
   * 追加查询参数params，并返回追加后的查询参数对象
   * @param params : Object   添加的params对象
   * @returns addSearchParams : Object    返回添加后的查询参数对象
   *
   *
   * 接口3:
   * addHashParams()
   * 获取添加的hash查询参数
   * @returns addSearchParams : Object    返回添加后的hash查询参数对象
   */
  addHashParams(key,value){

    if  (key){

      let addHashParams = this.urlUtils.addHashParams || {};
      if (typeof key == "object"){
        Object.assign(addHashParams,key);
      } else {
        addHashParams[key] = value;
      }
      this._deleUrlUtilsFor("addHashParams");
      this.urlUtils.addHashParams = addHashParams;
    }

    return this.urlUtils.addHashParams;

  }





}



window.ByURL = ByURL;

//ByURL：结束









// 普通解析与字符串化：开始


//不依赖 URL 和 URLSearchParams 的解析：开始


/**
 *默认的 paramsPropParse ; 用JSON解析参数的属性
 */
function _paramsPropJSONParse(value) {
  return JSON.correctParse(value);
}



/**
 *默认的 paramsPropStringify ；用JSON序列化参数的属性
 */
function _paramsPropJSONStringify(value,key,params) {
    if (typeof value == "object"){
      value = JSON.stringify(value);
    }
    return value;
}




/**
 * 把url字符串解析成 UrlUtils 对象； UrlUtils 对象是包含所有 url 组件的对象；
 * 注意：
 * - 本方法中没有依赖 URL 类型进行解析，使用是纯粹的字符中解析，所以可以在不支持 URL 类型的环境下使用，比如：小程序；
 * - 当 searchParams 和 hashParams 中的的属性值是 JSON 字符串时，会自动转对象
 *
 * @param urlStr : string   必选；url字符串，可以是无效的或者不完整的url字符串
 * @param paramsPropParse ? : (value,key,queryString)=> value    可选；用于在解析 URL 时 url 的参数的值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 JSON 字符中串，则将其转为对象，不则，原样输出；
 * @param paramsPropStringify ? : (value,key,params)=> string    可选；用于在序列化的对象参数时对参数的属性值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 对象类型，则将其转为JSON字符串，否则，正常序列化；
 * @returns urlUtils : UrlUtils
 *
 返回的对象 UrlUtils 对象包含以下属性
 href:string,    //包含完整 URL 的 DOMString。
 url:string,   //不包含search和hase 的url
 origin:string,  //返回一个包含协议名、域名和端口号的 DOMString。
 protocol:string,  //包含 URL 协议名的 DOMString，末尾不带 ':'。
 host:string,  //包含 URL 域名，':'，和端口号的 DOMString。
 hostname:string,  //包含 URL 域名的 DOMString。
 port:string,    //包含 URL 端口号的 DOMString。
 pathname:string,  //URL 的路径的字符串。
 pathList:Array,  //url的路径名列表
 absPath:boolean, //pathname 是否是经对路径
 search:string,    //以 '?' 起头紧跟着 URL 请求参数的 DOMString。
 searchParams:Object,  //查询参数search的对象形式
 hash:string, //以 '#' 起头紧跟着 URL 锚点标记的 DOMString。
 hashSearch:string, // 哈唏hash中的查询字符串
 hashParams:Object,   //哈唏hash中的参数
 hashUrlUtils:UrlUtils,  //把哈唏字符串 hash 作为 url 解析成的 urlUtils
 params:Object,    //url中所有的参数，包括 searchParams 和 hashParams
 *
 */
window.parseUrl = function parseUrl(urlStr,paramsPropParse,paramsPropStringify){
  var protocolRegExp = /^\w+(?=:\/\/)/;
  var hostRegExp = /([^./:\s]+(?:\.[^./:\s]+)+)(?::(\d+))?|([^./:\s]+)(?::(\d+))/;

  if (!paramsPropParse){
    paramsPropParse = _paramsPropJSONParse;
  }


  if (!paramsPropStringify){
    paramsPropStringify = _paramsPropJSONStringify;
  }

  var href = urlStr.trim();
  var {url,search,hash} = splitURLByQueryString(href);


  //解析协间 protocol
  if (url){
    var hostUrl = url;
    var protoList = url.split("://");
    if (protoList.length > 1){
      var protocol = protoList[0];
      var hostUrl = protoList[1];
    }
  }





  //解析域名和路径 host hostname port pathname  pathList absPath
  if (hostUrl){
    var hostList = hostUrl.split("/");

    if (hostList.length > 1){

      var hostItem0 = hostList[0];

      if (/^\.+$/.test(hostItem0)){ //以 .开关：相对路径
        var pathname = hostUrl;
        var pathList = hostList.slice(1);
        var absPath = false;     //绝对路径的标识设置为假
      }else if (hostItem0) {
        var hostRegRes = hostItem0.match(hostRegExp);
        if (hostRegRes){  //判断通过/分隔后的第一个元素是否符合 host 的格式
          var host = hostRegRes[0];
          var hostname = hostRegRes[1] || hostRegRes[3];
          var port = hostRegRes[2] || hostRegRes[4];
          pathList = hostList.slice(1);
          pathname = "/" + pathList.join("/");
          absPath = true;
        }else {
          absPath = false;
          pathList = hostList;
          pathname = hostUrl;
        }

      }else { //如果通过/分隔后的第一个元素为空字符串，则说明 hostUrl 是个绝对路径
        pathList =  hostList.slice(1);
        pathname = hostUrl;
        absPath = true;
      }



    }else { //如果 hostUrl 中不包含 / ，则说明 hostUrl 是单个域名
      hostRegRes = hostUrl.match(hostRegExp);
      if (hostRegRes) {
        host = hostUrl;
        hostname = hostRegRes[1];
        port = hostRegRes[2];
        absPath = true;
      }else {
        pathname = hostUrl;
        pathList = hostList;
        absPath = false;
      }

    }

  }




  //构造 origin
  if (host) {
    if (protocol){
      var origin = protocol + "://" + host;
    } else {
      origin = host
    }

  }



  //解析查询字符串 search  params
  if (search) {
    var searchParams = parseQueryString(search,paramsPropParse);
  }

  //解析哈唏 hash hashParams
  if (hash){
    var hashParamStr = hash.replace(/^#+/,"");
    var hashUrlUtils = parseUrl(hashParamStr,paramsPropParse,paramsPropStringify);
    var hashSearch = hashUrlUtils.search;
    var hashParams = hashUrlUtils.params;
  }


  //构造 params 对象
  if  (searchParams || hashParams){
    var params = {};
    if (searchParams){
      Object.assign(params,searchParams);
    }

    if (hashParams){
      Object.assign(params,hashParams);
    }
  }




  //构造 UrlUtils
  var urlUtils = {
    href:href,    //包含完整 URL 的 DOMString。
    url:url,   //不包含search和hase 的url
    origin:origin,  //返回一个包含协议名、域名和端口号的 DOMString。
    protocol:protocol,  //包含 URL 协议名的 DOMString，末尾不带 ':'。
    host:host,  //包含 URL 域名，':'，和端口号的 DOMString。
    hostname:hostname,  //包含 URL 域名的 DOMString。
    port:port,    //包含 URL 端口号的 DOMString。
    pathname:pathname,  //URL 的路径的字符串。
    pathList:pathList,  //url的路径名列表
    absPath:absPath, //pathname 是否是经对路径
    search:search,    //以 '?' 起头紧跟着 URL 请求参数的 DOMString。
    searchParams:searchParams,  //查询参数search的对象形式
    hash:hash, //以 '#' 起头紧跟着 URL 锚点标记的 DOMString。
    hashSearch:hashSearch, // 哈唏hash中的查询字符串
    hashParams:hashParams,   //哈唏hash中的参数
    hashUrlUtils:hashUrlUtils,  //把哈唏字符串 hash 作为 url 解析成的 urlUtils
    params:params,    //url中所有的参数，包括 searchParams 和 hashParams
  };


  //精简 UrlUtils 对象，只保留有属性值的属性；
  var simpUrlUtils = Object.keys(urlUtils).reduce(function (total, key) {
    var value = urlUtils[key];
    if (value != null){
      total[key] = value;
    }
    return total;
  },{});


  return simpUrlUtils;
}






/**
 * 把  UrlUtils 对象序列化成 url 字符串； UrlUtils 对象是包含所有 url 组件的对象；
 *
 * @param urlUtils : UrlUtils   必选；url字符串，可以是无效的或者不完整的url字符串
 * @param paramsPropStringify ? : (value,key,params)=> string    可选；用于在序列化的对象参数时对参数的属性值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 对象类型，则将其转为JSON字符串，否则，正常序列化；
 * @param paramsPropParse ? : (value,key,queryString)=> value    可选；用于在解析 URL 时 url 的参数的值 进行转换；未指定该参数时,默认的逻辑是：如果属性值是 JSON 字符中串，则将其转为对象，不则，原样输出；
 * @returns urlStr : string
 *
 *
 * 注意：
 * - 本方法中没有依赖 URL 类型进行解析，使用是纯粹的字符中解析，所以可以在不支持 URL 类型的环境下使用，比如：小程序；
 * - 当 searchParams 和 hashParams 中的的属性值是 JSON 字符串时，会自动转对象
 * - 对于 urlUtils 中 顶层与 hash 相关的属性 比 urlUtils 属性 hashUrlUtils 中相应的属性优先级更高；
 * - 对于 urlUtils 中有冲突的url组件属性，则以组件粒度较细者优先；如：如果 urlUtils 中同时设置了 href 和 host 属性，则 host 属性值会取代 href 属性中的 host 部分；
 *
 *
 *
 *
 * urlUtils 对象可配置的属性包括 parseUrl 方法能解析出的所有属性，此还，还包括侯个新的属性：addSearch、addSearchParams、addHashSearch、addHashParams ；
 * urlUtils 中可配置的属性如下：
 addSearch: string   //另外追加的 search 字符串，该属性优先级低于addSearchParams
 addSearchParams: Object  // 另外追加的 search 对象，该属性优先级高于 addSearch
 addHashSearch: string   //另外追加的 hashSearch 字符串，该属性优先级低于 addHashParams
 addHashParams: Object  // 另外追加的 hashSearch 对象，该属性优先级高于 addHashSearch

 href:string,    //包含完整 URL 的 DOMString。
 url:string,   //不包含search和hase 的url
 origin:string,  //返回一个包含协议名、域名和端口号的 DOMString。
 protocol:string,  //包含 URL 协议名的 DOMString，末尾不带 ':'。
 host:string,  //包含 URL 域名，':'，和端口号的 DOMString。
 hostname:string,  //包含 URL 域名的 DOMString。
 port:string,    //包含 URL 端口号的 DOMString。
 pathname:string,  //URL 的路径的字符串。
 pathList:Array,  //url的路径名列表
 absPath:boolean, //pathname 是否是经对路径
 search:string,    //以 '?' 起头紧跟着 URL 请求参数的 DOMString。该属性的优先级低于 searchParams
 searchParams:Object,  //查询参数search的对象形式；如果没有设置该属性，则默认取 在 params 中 但不在 hashParams 中的所有属性组成的对象来代替； 该属性的优先级高于 search
 hash:string, //以 '#' 起头紧跟着 URL 锚点标记的 DOMString。该属性会 覆盖 hashUrlUtils.href 属性；
 hashSearch:string, // 哈唏hash中的查询字符串； 该属性的优先级低于 hashParams
 hashParams:Object,   //哈唏hash中的参数；如果没有设置该属性 且 设置了 searchParams，则默认取 在 params 中 但不在 searchParams 中的所有属性组成的对象来代替； 该属性的优先级高于 hashSearch； hashSearch 和 hashParams 之合 会 覆盖 hashUrlUtils.searchParams 属性；
 hashUrlUtils:UrlUtils,  //把哈唏字符串 hash 作为 url 解析成的 urlUtils； 顶层中的 hashSearch 和 hashParams 之合 会 覆盖 hashUrlUtils.searchParams 属性；
 params:Object,    //url的参数；
 *
 *
 */
window.stringifyUrl = function stringifyUrl(urlUtils,paramsPropStringify,paramsPropParse){
  var urlStr = "";

  if (!paramsPropStringify){
    paramsPropStringify = _paramsPropJSONStringify;
  }



  if (!paramsPropParse){
    paramsPropParse = _paramsPropJSONParse;
  }


  var href = urlUtils.href || urlUtils.url || urlUtils.origin;
  if (href){
    var hrefUrlUtils = parseUrl(href,paramsPropParse,paramsPropStringify);
    urlUtils = Object.assign(hrefUrlUtils,urlUtils)
  }


  //拼接协意 protocol
  var protocol = urlUtils.protocol;
  if (protocol){
    urlStr = protocol + "://";
  }

  //拼接域名 host
  var host = urlUtils.host;
  var hostname = urlUtils.hostname;
  if  (hostname){
    host = hostname;
    var port = urlUtils.port;
    if (port){
      host += ":" + port;
    }
  }


  if (host){
    urlStr += host ;
  }



  //拼接路径 pathname
  var pathname = urlUtils.pathname;
  var pathList = urlUtils.pathList;
  var absPath = urlUtils.absPath;
  if (!pathname && pathList) {
    pathname = "/" + pathList.join("/");
  }
  if (pathname){
    pathname = pathname.trim();
    if (urlStr || absPath === true) {
      pathname = pathname.replace(/^[./]*/,"/");
    }
    urlStr += pathname;
  }








  //追加查询参数 addSearch 或 addSearchParams
  var search = urlUtils.search;
  var searchParams = urlUtils.searchParams;

  if (!searchParams && search){
    searchParams = parseQueryString(search,paramsPropParse);
  }

  if (searchParams){
    var mergedSearchParams = Object.assign({},searchParams);
  }

  var params = urlUtils.params;
  if(!searchParams && params){
    var excludeParams = urlUtils.hashParams || {};
    var excludeKeys = Object.keys(excludeParams)
    searchParams = params.filterProperty(function (key) {
      return !excludeKeys.includes(key);
    });

    if (searchParams.noKeys){
      searchParams = null;
    }
  }

  var addSearchParams = urlUtils.addSearchParams;
  var addSearch = urlUtils.addSearch;
  if (!addSearchParams && addSearch){
    addSearchParams = parseQueryString(addSearch,paramsPropParse);;
  }

  if (searchParams && addSearchParams){
    searchParams = Object.assign({},searchParams,addSearchParams);
  }else if (addSearchParams){
    searchParams = addSearchParams;
  }




  //拼接路径 search
  if (searchParams && !searchParams.noKeys){
    search = queryStringify(searchParams,true,paramsPropStringify);
  }else {
    search = null;
  }

  if (search){
    urlStr += search;
  }



  //追加哈唏参数 addHashSearch 或 addHashParams
  var hashSearch = urlUtils.hashSearch;
  var hashParams = urlUtils.hashParams;

  if (!hashParams && hashSearch){
    hashParams = parseQueryString(hashSearch,paramsPropParse);
  }

  if(!hashParams && mergedSearchParams && params){
    excludeKeys = Object.keys(mergedSearchParams)
    hashParams = params.filterProperty(function (key) {
      return !excludeKeys.includes(key);
    });

    if (hashParams.noKeys){
      hashParams = null;
    }
  }



  var addHashParams = urlUtils.addHashParams;
  var addHashSearch = urlUtils.addHashSearch;
  if (!addHashParams && addHashSearch){
    addHashParams = parseQueryString(addHashSearch,paramsPropParse);;
  }

  if (hashParams && addHashParams){
    hashParams = Object.assign({},hashParams,addHashParams);
  }else if (addHashParams){
    hashParams = addHashParams;
  }




  //拼接哈唏 hash
  var hash = urlUtils.hash;
  var hashUrlUtils = urlUtils.hashUrlUtils;


  if (hashUrlUtils || hashParams) {

    if (hashUrlUtils){
      hashUrlUtils = Object.assign({},hashUrlUtils)
    }else {
      hashUrlUtils = {};
    }

    if (hash){
      hash = hash.replace(/^#+/,"");
      hashUrlUtils.href = hash;
    }

    if (hashParams) {
      hashUrlUtils.searchParams = hashParams;
    }

    if (!hashUrlUtils.noKeys){
      hash = stringifyUrl(hashUrlUtils,paramsPropStringify,paramsPropParse);
    }

  }


  if (hash) {
    hash = hash.replace(/^#*/,"#");
    urlStr += hash;
  }


  return urlStr;
}








/**
 * 把url字符串分隔成 url、查询字符串search 和 哈唏hash 三段字符串；
 * @param urlStr
 * @returns {url: string, search: string, hash: string}   其中，url字符串不包括 search 和 hash ；并且 search 开头有 "?", hash 开头有 "#"
 *
 * 本方法法之所以没用正则 和 URL 等，目的是为了防止 urlStr 中 有 多个 ## 等不规范情况 和 让该方法具有通用性
 */
window.splitURLByQueryString = function splitURLByQueryString(urlStr) {

  var preIndex = urlStr.indexOf("?");
  var anrIndex = urlStr.indexOf("#");

  var urlQS = urlStr;
  var hash = undefined;
  if (anrIndex >= 0){
    urlQS = urlStr.substring(0,anrIndex);
    hash = urlStr.substring(anrIndex);
  }

  var search = undefined;
  var url = urlQS;
  if (preIndex >= 0) {
    search = urlQS.substring(preIndex);
    url = urlQS.substring(0,preIndex);
  }

  return {url,search,hash};
}











// JSON解析与字符串化：开始



/**
 * 把对象 obj 用JSON的方式格式化成 URL 的参数格式；
 * @param obj : Object   必选；被格式化的对象
 * @param queryPrefix ? : boolean    可选；默认值：false; 是否带URL的查询字符串前缀 ?
 * @returns 格式化后的 URL 的参数格式
 *
 *
 * 说明
 * 当URL参数对象 obj 不只有一层属性（如果obj的属性也是对象）时，URL的查询字符串就很很表示了；本方法就是用来解决这个问题；
 * 被本方法格式化的URL查询字符串，需要用 JSON 的 parseQueryString 方法来解析成对象；
 *
 */
window.JSONQueryStringify = function JSONQueryStringify(obj,queryPrefix) {
  return window.queryStringify(obj,queryPrefix,_paramsPropJSONStringify);
}



/**
 * 把 通过 JSONQueryStringify 格式化后的查询字符串 queryString 解析成 对象；
 * @param queryString : string   必选；被格式化的对象
 * @returns 解析后的对象
 *
 */
window.parseJSONQueryString =  function parseJSONQueryString(queryString) {
  return window.parseQueryString(queryString,_paramsPropJSONParse);
}







/**
 * parseJSONQueryStrObjProperty(queryObj)
 * 把 通过 JSONQueryStringify 格式化后的查询字符串的对象的属性 解析成 真实的值；
 * @param queryObj : Object   必选；查询字符串对象; 一般是经过初次查询字符串的解析(比如：parseQueryString)成的对象；
 * @returns 解析后的对象
 *
 */
window.parseJSONQueryStrObjProperty = function parseJSONQueryStrObjProperty(queryObj) {
  return Object.entries(queryObj).reduce(function (total, kvList) {
    let key = kvList[0];
    let jsonStr = decodeURIComponent(kvList[1]);
    total[key] = JSON.correctParse(kvList[1]);

    return total;
  }, {});

};



// JSON解析与字符串化：结束




//查询字符串：开始


/**
 * 接口1
 * queryStringify(params,queryPrefix,paramsPropStringify)
 * @param params : Object    被序列化的参数对象
 * @param queryPrefix ? : boolean   可选；默认值：false ; 是否带有 ？ 前缀
 * @param paramsPropStringify ? : (value,key,params)=> string    可选； 对 value 进行转换的函数；
 * @returns string   序列化后的url查询字符串
 *
 *
 *
 *
 * 接口2:
 * queryStringify(params,paramsPropStringify)
 * @param params : Object    被序列化的参数对象
 * @param paramsPropStringify ? : (value,key,params)=> string    可选； 对 value 进行转换的函数；
 * @returns string   序列化后的url查询字符串
 */
window.queryStringify = function queryStringify(params,queryPrefix,paramsPropStringify) {
  if (arguments.length == 2 && typeof queryPrefix == "function"){
    paramsPropStringify = queryPrefix;
    queryPrefix = undefined;
  }


  if (!paramsPropStringify){
    paramsPropStringify = function (value) {
      return value;
    };
  }


  var paramList = Object.entries(params).map(function (kvArr, index, array) {
    var key = kvArr[0];
    var keyStr = encodeURIComponent(key);

    var value = kvArr[1];
    value = paramsPropStringify.call(params,value,key,params);
    var valueStr = encodeURIComponent(value);

    return keyStr + "=" + valueStr;
  });

  var queryString = paramList.join("&");

  if (queryPrefix){
    queryString = "?" + queryString;
  }

  return queryString;

};


/**
 * parseQueryString(queryString,paramsPropParse)
 * @param queryString : string    被解析的查询字符串；
 * @param paramsPropParse ? : (value,key,queryString)=> value    可选；对 value 进行转换
 * @returns Object   解析后的对象
 */
window.parseQueryString =  function parseQueryString(queryString,paramsPropParse) {
  if (!paramsPropParse){
    paramsPropParse = function (value) {
      return value;
    };
  }


  var preIndex = queryString.indexOf("?");
  var anrIndex = queryString.indexOf("#");

  if (anrIndex == -1){
    anrIndex = undefined;
  }
  queryString = queryString.substring(preIndex + 1,anrIndex);

  queryString = queryString.replace(/^\?/,"");
  var kvStrList = queryString.split("&");

  return kvStrList.reduce(function (obj, kvStr) {
    var kvList = kvStr.split("=");
    var key = decodeURIComponent(kvList[0]);
    var value = decodeURIComponent(kvList[1]);
    value = paramsPropParse(value,key,queryString);
    obj[key] = value;

    return obj;
  },{});
}




//查询字符串：结束







//类查询字符串：开始


/**
 * similarQueryStringify(params,separOpts)
 * 将对类转化成 类似查询字符串格式的字符串
 *
 * @param params : Object    被序列化的参数对象
 * @param separOpts ? : {prop,kv,map}   可选；分隔符 和 值解析回调 的配置选项；
 * separOpts.prop ?: string     可选；默认值："&"；属性与属性之间的分隔符；
 * separOpts.kv ?: string     可选；默认值："="；key 和 value 之间的分隔符；
 * separOpts.map  ? : (value,key,params)=> string    可选； 对 value 进行转换的函数；
 *
 * @returns string   序列化后的类查询字符串
 */
window.similarQueryStringify = function similarQueryStringify(params,separOpts) {

  var {prop:propSeparator,kv:kvSeparator,map:paramsPropStringify} = separOpts || {};

  if (propSeparator == null){
    propSeparator = "&";
  }

  if (kvSeparator == null){
    kvSeparator = "=";
  }

  if (!paramsPropStringify){
    paramsPropStringify = function (value) {
      return value;
    };
  }


  var paramList = Object.entries(params).map(function (kvArr, index, array) {
    var key = kvArr[0];

    var value = kvArr[1];
    value = paramsPropStringify.call(params,value,key,params);

    return key + kvSeparator + value;
  });

  var queryString = paramList.join(propSeparator);

  return queryString;
};



/**
 * parseSimilarQueryString(queryString,separOpts)
 * 解析 类似查询字符串格式的字符串
 *
 * @param queryString : string    被解析的类似查询字符串格式的字符串；
 * @param separOpts ? : {prop,kv,map}   可选；分隔符 和 值解析回调 的配置选项；
 * separOpts.prop ?: string     可选；默认值："&"；属性与属性之间的分隔符；
 * separOpts.kv ?: string     可选；默认值："="；key 和 value 之间的分隔符；
 * separOpts.map  ? : (value,key,queryString)=> value    可选；对 value 进行转换
 *
 * @returns Object   解析后的对象
 */
window.parseSimilarQueryString =  function parseSimilarQueryString(queryString,separOpts) {

  var {prop:propSeparator,kv:kvSeparator,map:paramsPropParse} = separOpts || {};

  if (propSeparator == null){
    propSeparator = "&";
  }

  if (kvSeparator == null){
    kvSeparator = "=";
  }

  if (!paramsPropParse){
    paramsPropParse = function (value) {
      return value;
    };
  }


  var kvStrList = queryString.split(propSeparator);

  return kvStrList.reduce(function (obj, kvStr) {
    var kvList = kvStr.split(kvSeparator);
    var key = kvList[0];
    var value = kvList[1];
    value = paramsPropParse(value,key,queryString);
    obj[key] = value;

    return obj;
  },{});
}



//类查询字符串：结束






//不依赖 URL 和 URLSearchParams 的解析：结束

















//依赖 URL 和 URLSearchParams 的解析：开始


/**
 * 字符串化 url 对象
 * @param urlObj : Object | URL | Location | string | 其它    必选；url 对象
 * @param replace : boolean     可选；默认值：false ;  url参数部分是否需要把旧的给替换掉
 * @returns urlStr  : string   返回url字符串
 *
 *
 *
 * @property urlObj.href  : string    字符串形式的url地址
 * @property urlObj.protocol  : string    包含URL对应协议的一个DOMString，最后有一个":"。
 * @property urlObj.host  : string    包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号
 * @property urlObj.pathname  : string    包含URL中路径部分的一个DOMString，开头有一个“/"。
 * @property urlObj.hash  : string    包含块标识符的DOMString，开头有一个“#”。
 * @property urlObj.params  : string | Object    url的参数对象 或者 字符串
 *
 */
window.stringifyUrlByURLClass = function stringifyUrlByURLClass(urlObj, replace){


  if (typeof urlObj != "object"){
    return urlObj;
  }

  let urlType = urlObj.constructor.name;

  switch (urlType){
    case "URL" :
    case "Location" :{
      return urlObj.href;
      break;
    }
    default:{
      var { href, protocol, host, pathname, params, hash} = urlObj;
    }
  }




  let urlInst = new window.URL(href);

  if (protocol){
    urlInst.protocol = protocol ;
  }

  if (host) {
    urlInst.host = host;
  }

  if (pathname) {
    let pathURLInst = new window.URL(pathname,href);
    urlInst.pathname = pathURLInst.pathname;
  }

  if (hash) {
    urlInst.hash = hash;
  }



  if (params){
    let searchParams = urlInst.searchParams

    let paramsType = typeof params;

    if (typeof params != "object") {
      if (replace) {
        urlInst.search = params;
      } else {
        let oriSearch = urlInst.search;
        let separ = oriSearch ? "&" : "";
        urlInst.search = oriSearch + separ + params;
      }
    } else {

      if (replace) {
        searchParams.resetParams(params);
      }else {
        searchParams.setParams(params);
      }

    }

  }




  return urlInst.href;

};







/**
 * 把 url 解析成普通的对象
 * @param url : string | URL | Location   必选；url 字符串 或者 URL、Location 实例
 * @returns urlObj  : { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams,params }   返回 包含URL所有信息的普通对象
 *
 *
 * @property urlObj.params  : Object    url的参数对象
 * 注意： urlObj 的其它属性跟 URL 实例的属性一样；即实现了 URLUtils 中定义的属性
 *
 */
window.parseUrlByURLClass = function parseUrlByURLClass(url){

  let urlInst = url;
  if (typeof url == "string"){
    urlInst = new window.URL(url);
  }

  var { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams } = urlInst;

  let urlObj = { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams };


  if (!searchParams && search) {
    searchParams = new window.URLSearchParams(search);
  }

  if  (searchParams){
    var params = searchParams.toParams();
  }

  urlObj.params = params;

  return urlObj;
}





//依赖 URL 和 URLSearchParams 的解析：结束





// 普通解析与字符串化：结束
