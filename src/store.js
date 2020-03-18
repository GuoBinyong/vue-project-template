import Vue from 'vue';
import Vuex from 'vuex';

import {appStoreConfigs} from './app/config.js';
import {defineListenablePropertyGetter} from  ':tools/ByTool'


Vue.use(Vuex);




let localStorageState = localStorage.getParsedItem('StoreState');
let storeOptions = Vuex.Store.mergeStoreConfigsWhitInitState(appStoreConfigs, localStorageState);

const store = new Vuex.Store(storeOptions);
defineListenablePropertyGetter(window.shareInst,"store",function () {
  return store
});
window.shareInst.store = store;



/*

//恢复数据
window.byAddListenerForMultipleEvent(["pageshow","foreground","webShow","displayChange"], function (event) {



  if (event.type == "displayChange" ) {

    let {webviewID,action} = event.data  ;
    let currWVO = window.plus.webview.currentWebview();

    if (! (currWVO.id != webviewID && action == "close" ) ){
      return ;
    }
  }

  if (event.type == "pageshow" && !event.persisted) {
    return ;
  }

  let localStorageState = localStorage.getParsedItem('StoreState');
  store.replaceState(localStorageState);
});
*/



//保存数据
window.byAddListenerForMultipleEvent(["pagehide","background","webClosed","webHide","displayChange","willQuit"],function (event) {

  if (event.type == "displayChange" ) {

    let {webviewID,action} = event.data  ;
    let currWVO = window.plus.webview.currentWebview();

    if (!(currWVO.id != webviewID && action == "show" ) ){
      return ;
    }
  }

  store.saveState();
});


export default store


