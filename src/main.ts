import './beforeLaunch';

// vue模块：开始
import Vue from 'vue'


Vue.config.productionTip = false

import router from './router'
import store from './store'
import App from ':app/App.vue'



var app = new Vue({
  // @ts-ignore
  router,
  store,
  render: h => h(App),
  beforeDestroy: function () {
    store.saveState();
  }
}).$mount('#app')


// @ts-ignore
by.defineListenablePropertyGetter(window.shareInst,"app",function () {
  return app
});

// @ts-ignore
window.shareInst.app = app;

// vue模块：结束
