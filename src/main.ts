import './beforeLaunch';

// vue模块：开始
import Vue from 'vue'


Vue.config.productionTip = false

import router from './router'
import store from './store'
import App from ':app/App.vue'




var app = new Vue({
  router,
  store,
  render: h => h(App),
  beforeDestroy: function () {
    store.saveState();
  }
}).$mount('#app')


declare global {
  interface shareInst {
    app:Vue;
    appReady:Promise<Vue>;
  }
}

by.defineListenableProperty(window.shareInst,"app",{
  getDefault:function () {return app}
});


window.shareInst.app = app;

// vue模块：结束
