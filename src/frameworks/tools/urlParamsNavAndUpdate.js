const disableNavToOnceLaunchLocaKey = "_disableNavToOnceLaunchLocaKey_";
const lastUrlUtilsKey = "_lastUrlUtilsKey_";


/**
 * createFunToNavToLaunchLocaOfParams(options)
 * 该函数用于生成 导航到启动位置的函数 navToLaunchLocaOfParams(url)； 生成的 navToLaunchLocaOfParams(url) 函数 可导航到 url 参数中指定的位置
 *
 * @param options : {locakey,navCB,once,every,clearParams}
 * locakey : string   必选； url 参数中表示 要导致到的位置 的key；
 * navCB : (launchLoca : any,launchUnit : UrlUnit,urlUtils : UrlUtils)=>Void    必选；需要执行导航时的回调函数；该函数负责完成真正的导航逻辑；
 * once ?: "searchParams" | "hashParams" | ["searchParams","hashParams"]   在一次会话过程中只会导航一次的 url 参数的属性名字 或 数组；即，如果 searchParams 中的 位置 需要只在整个会话（session）中导航一次，即刷新也不再导航，那么可能过把 "searchParams" 传给该属性
 * every ?: "searchParams" | "hashParams" | ["searchParams","hashParams"]   在一次会话过程中每次重新加载页面者会导航的 url 参数的属性名字 或 数组；即，如果 searchParams 中的 位置 需要在整个会话（session）中每次加载页面都导航，那么可能过把 "searchParams" 传给该属性
 * clearParams ?: ClearExtraUrlParams   清除多余参数的配置；
 *
 * @return navToLaunchLocaOfParams(url) :  返回一个函数 navToLaunchLocaOfParams(url)，该函数用于根据 options 的配置导航到相应的位置
 */
export function createFunToNavToLaunchLocaOfParams(options) {
  var {locakey,navCB,once,every,clearParams} = options;

  if  (clearParams){
    var clearExtra = clearExtraUrlParams(clearParams,null,true);
  }

  if (!clearExtra){
    var currUrlUtils = parseUrl(location.href);
    sessionStorage.setAnyItem(lastUrlUtilsKey,currUrlUtils);
  }




  if  (!(once || every)){
    once = ["searchParams"]
  }else {

    if (!once){
      once = []
    }else if (!Array.isArray(once)){
      once = [once]
    }

    if (!every){
      every = []
    }else if (!Array.isArray(every)){
      every = [every]
    }

  }


  function navToLaunchLocaOfParams(url) {
    if (!url){
      url = location.href;
    }

    if (typeof url == "object"){
      var urlUtils = url;
    }else {
      urlUtils = parseUrl(url);
    }



    var unitKey = every.find(function (aUnitKey) {
      var aUnit = urlUtils[aUnitKey];
      return aUnit && aUnit[locakey];
    });

    if (unitKey){
      var launchUnit = urlUtils[unitKey];
      var launchLoca = launchUnit[locakey];
    }


    if (!launchLoca){
      unitKey = once.find(function (aUnitKey) {
        var aUnit = urlUtils[aUnitKey];
        return aUnit && aUnit[locakey];
      });

      if (unitKey){
        launchUnit = urlUtils[unitKey];
        launchLoca = launchUnit[locakey];
      }


      if (launchLoca){
        if (window[disableNavToOnceLaunchLocaKey]){
          return
        }

        var disableNextNav = sessionStorage.getParsedItem(disableNavToOnceLaunchLocaKey);
        if (disableNextNav){
          sessionStorage.removeItem(disableNavToOnceLaunchLocaKey);
          return;
        }

        var lastUrlUtils = sessionStorage.getParsedItem(lastUrlUtilsKey);
        var lastOnceUnit = lastUrlUtils && lastUrlUtils[unitKey];
        if (Object.isDepthEqual(launchUnit,lastOnceUnit,true)){
          return;
        }
      }

    }


    if (launchLoca) {
      navCB(launchLoca,launchUnit,urlUtils);
    }
  }


  return navToLaunchLocaOfParams;
}







/**
 * replaceCurrUrlByDisableNav(url,allowNavToLaunchLoca)
 * 替换当前 url 并 禁止导航到一次启动位置
 * @param url : string | UrlUtils   要被替换成的 url
 * @param allowNavToLaunchLoca ?: boolean   可选；默认值：fasle；是否允许导航到启动位置；
 */
export function replaceCurrUrlByDisableNav(url,allowNavToLaunchLoca){
  if (!allowNavToLaunchLoca){
    sessionStorage.setAnyItem(disableNavToOnceLaunchLocaKey,true);
  }
  window[disableNavToOnceLaunchLocaKey] = true;
  var newUrl = (typeof url == "object") ? stringifyUrl(url) : url;
  location.replace(newUrl);
};



/**
 * clearExtraUrlParams(extraOptions,urlUtils,allowNavToLaunchLoca)
 * 清除多余的url参数
 * @param extraOptions : ClearExtraUrlParams   必须；配置 searchParams 和 hashParams 的  包含 和 排除 的 key 的 数组 的 选项；如果 直接传 IncludeAndExcludeKeysOptions 类型的对象，则默认会被应用到 searchParams 和 hashParams
 * @param urlUtils ?: UrlUtils    可选；默认值：当前 location.href 的 UrlUtils 对象； 被清理的url；
 * @param allowNavToLaunchLoca ?: boolean   可选；默认值：fasle；是否允许导航到启动位置；
 * @return boolean : 原来的 url 是否需要被清除
 *
 * ClearExtraUrlParams = IncludeAndExcludeKeysOptions | {search:IncludeAndExcludeKeysOptions,hash:IncludeAndExcludeKeysOptions}
 */
export function clearExtraUrlParams(extraOptions,urlUtils,allowNavToLaunchLoca){
  if (!urlUtils){
    urlUtils = parseUrl(location.href);
  }else {
    urlUtils = {...urlUtils};
  }

  var {search,hash} = extraOptions;
  if (!(search || hash)){
    search = hash = extraOptions;
  }


  var {searchParams,hashParams} = urlUtils.searchParams;

  if (searchParams && search){
    var pureSearchParams = Object.assignIncludeAndExcludeKeys({},search,searchParams);
    var needClearSearch = Object.keys(pureSearchParams).length != Object.keys(searchParams).length;
  }

  if (hashParams && hash){
    var pureHashParams = Object.assignIncludeAndExcludeKeys({},hash,hashParams);
    var needClearHash = Object.keys(pureHashParams).length != Object.keys(hashParams).length;
  }

  var needClear = needClearSearch || needClearHash;
  if (needClear){
    urlUtils.searchParams = pureSearchParams;
    urlUtils.hashParams = pureHashParams;
    replaceCurrUrlByDisableNav(urlUtils,allowNavToLaunchLoca);
  }

  return needClear;
}
