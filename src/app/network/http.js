import HttpRequest from ':libraries/HttpRequest' ;
import {defineListenablePropertyGetter} from  ':tools/ByTool'


// 域名:开始
let domain = null;

domain = "192.168.19.208:9245";

if (process.env.NODE_ENV === 'production') {
  domain = "www.jknys.cn:8060";     //正式
}

// 域名:结束


const baseURL = `http://${domain}/`;    //url的基地址，根url


const httpConfig = {
  baseURL: baseURL,
  // method: "GET",     //默认的请求方式
  // publicData:{},     //公共参数
  // reqTransforms: [],   //请求参数转换器列表
  mainData: true,
  mainDataGet: function (responseData) {
    return responseData.data;
  },

  // 请求成功或者失败的弹窗回调函数
  promptHandle: function (info, success) {

    let toastOption = {
      type: "text"
    };

    if (success) { // 请求成功
      toastOption.text = "请求成功";
    } else {  // 请求失败
      toastOption.text = "请求失败";
    }

    // shareInst.app.$vux.toast.show(toastOption);

  },

  // 开始显示loading提示的回调函数
  startLoadingHandle: function (loadText, reqOptions,otherInfo) {
    if (shareInst.app && shareInst.app.$vux){
      // shareInst.app.$vux.loading.show({
      //   text: loadText
      // });
    }
  },

  // 结束显示loading提示的回调函数
  endLoadingHandle: function (succeed,reqOptions,resData,otherInfo) {
    let {showCount,globalShowCount,doneCount,doneCountManager}  = otherInfo;
    let allDone = doneCountManager.done;
    if (showCount == 1 && allDone && shareInst.app && shareInst.app.$vux) {
      // shareInst.app.$vux.loading.hide();
    }
  },

  endRequestHandle:function(succeed,reqOptions,resData,addInfo){
    var {showCount,loadingDoneAgain,loadingDoneCount,loadingDoneCountManager,requestDoneAgain,requestDoneCount,requestDoneCountManager,http} = addInfo;

    if ( loadingDoneCountManager && loadingDoneCountManager.done && showCount <= 1 && shareInst.app && shareInst.app.$vux) {
      // shareInst.app.$vux.loading.hide();
    }
  },
  successPrompt: true,
  failPrompt: true,
  showLoading: true,
  // loadText: shareData.loadindTexts.request,
  doneAgain:{
    urlAsDoneCountName:true,
    autoIncrTotalIfRepeat:true,
  }
};


defineListenablePropertyGetter(window.shareInst,"http",function () {
  return new HttpRequest(httpConfig);
});

window.shareInst.http;
