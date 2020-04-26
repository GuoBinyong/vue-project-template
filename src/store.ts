import Vue from 'vue';

import Vuex ,{Store}from 'vuex';


import {appStoreConfigs} from './app/config';

import "vuex-expand"

Vue.use(Vuex);



declare global {

  interface ShareInst {
    store:Store<typeof storeOptions>;
    storeReady:Promise<Store<typeof storeOptions>>;
  }

}




let localStorageState = localStorage.getParsedItem('StoreState');
let storeOptions = Vuex.Store.mergeStoreConfigsWhitInitState(appStoreConfigs, localStorageState);

const store = new Vuex.Store(storeOptions);
by.defineListenablePropertyGetter(window.shareInst,"store",function () {
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

  /*if (event.type == "displayChange" ) {

    let {webviewID,action} = event.data  ;
    let currWVO = window.plus.webview.currentWebview();

    if (!(currWVO.id != webviewID && action == "show" ) ){
      return ;
    }
  }*/

  store.saveState();
});


export default store


