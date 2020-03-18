/**
 * 生成派发事件的js字符串代码
 * @param eventName : string   事件的各字
 * @param data : any   要传送的数据
 * @return {string}
 */
function createDispatchEventJSStr (eventName, data) {

  return `
      var webviewEvent = new Event("${eventName}", {
        "bubbles": true
      });
      webviewEvent.data = ${JSON.stringify(data)};
      window.dispatchEvent(webviewEvent);
      `;
}






/**
 * 往所有webview中派发事件
 * @param {Object} eventName
 * @param {Object} data
 */
export function webviewEventBroadcast(eventName, data) {

  console.log("----webviewEventBroadcast:" + eventName  + JSON.stringify(data) );

  var evalJSStr = createDispatchEventJSStr(eventName, data);

  var allWVOs = plus.webview.all();
  allWVOs.forEach(function(wvo) {
    console.log("----WebviewID:" + wvo.id);
    wvo.evalJS(evalJSStr);
  });

}










/**
 * 在当前Webview分发事件系列
 * @param series : string    事件系列名字
 * @param name : string     事件名字
 * @param data : any   分发事件的附加数据
 */
export function dispenseEventSeries(series,name,data) {
  console.log("---dispenseEventSeries函数已被调用：" + series + "|" + name + "|" + JSON.stringify(data) );

  switch (series){
    case "Broadcast" :{
      webviewEventBroadcast(name,data);
      break;
    }

    case "ClientEvent" :{
      shareInst.client.dispatchClientEvent(name,data);
      break;
    }

  }

}






/**
 * 在 LaunchWebview 中分发事件系列
 * @param series : string    事件系列名字
 * @param name : string     事件名字
 * @param data : any   分发事件的附加数据
 */
export function dispenseEventSeriesInLaunch(series,name,data) {
  console.log("----dispenseEventSeriesInLaunch:" + name  + JSON.stringify(data) );

  var lanchWVO = plus.webview.getLaunchWebview();
  var evalJSStr = 'window.dispenseEventSeries("' + series + '" , "' + name + '" , ' + JSON.stringify(data) + ')';
  lanchWVO.evalJS(evalJSStr);
}









/**
 * 拦截当webview加载的url地址，然后在根据配置在相应的webview中打开被拦截的地址
 * @param notRemoveOverrideUrl ? : boolean     可选；默认值：false； 不需要在当前 webview 加载页面时 移除 overrideUrlLoading 处理器；    正常应移除的，即 notRemoveOverrideUrl 为 false，由于Android 有bug ；所以在 Android 端不能移除，即 notRemoveOverrideUrl为true
 * @param configOptions : {urlOptions : WebviewOverrideUrlOptions, excludes :  RegExp | [RegExp], webviewStyles : WebviewStyles}  配置对象，可配置的属性如下：
 *
 * @property outPageOptions.urlOptions : WebviewOverrideUrlOptions  拦截Webview窗口URL请求的配置对象
 * @property outPageOptions.excludes : RegExp | [RegExp]    排除的正则 或 正则的数组
 * @property outPageOptions.webviewStyles : WebviewStyles  OutPage的Webview窗口样式（如窗口宽、高、位置等信息）
 */
export function configManuallyMatchURLForWebview({urlOptions, excludes, webviewStyles},notRemoveOverrideUrl) {
  let currWVO = plus.webview.currentWebview();

  if (!Array.isArray(excludes)) {
    excludes = [excludes];
  }




  currWVO.overrideUrlLoading(urlOptions, function (eve) {
    debugger
    console.log("--------拦截Webview的地址：" + JSON.stringify(eve));

    let url = eve.url;

    let isExcluded = excludes.some(function (excludeReg) {
      return excludeReg.test(url)
    });

    if (isExcluded) {

      if (!notRemoveOverrideUrl){
        currWVO.overrideUrlLoading();
      }
      currWVO.loadURL(url);

      console.log("--------在当前Webview加载地址：" + JSON.stringify(eve));

    } else {

      let outPageWVO = plus.webview.create(url, "OutPage", webviewStyles);
      outPageWVO.appendJsFile('_www/common.append.js');
      outPageWVO.show();

      console.log("--------在OutPage的Webview中加载地址：" + JSON.stringify(eve));
    }
  });


}
