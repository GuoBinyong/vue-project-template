import './beforeLaunch';

// vue模块：开始
import Vue from 'vue'

Vue.config.productionTip = false

import router from './router.js'
import store from './store.js'
import App from ':app/App.vue'
// @ts-ignore
import {defineListenablePropertyGetter} from  ':frameworks/tools/ByTool.js'


var app = new Vue({
  // @ts-ignore
  router,
  store,
  render: h => h(App),
  beforeDestroy: function () {
    store.saveState();
  }
}).$mount('#app')



defineListenablePropertyGetter(window.shareInst,"app",function () {
  return app
});


window.shareInst.app = app;

// vue模块：结束
