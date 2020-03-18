// import ':compatible/index';
import ':network/http'
import * as Api from ':network/Api'

//挂载Api
window.shareInst.Api = Api ;


//文件初始化：结束


// FastClick : 开始
/* import FastClick from 'fastclick'

FastClick.attach(document.body) */
// FastClick : 结束


// vue模块：开始
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouterExtendPlugin from ':libraries/VueRouterExtendPlugin'

Vue.usePlugins([[VueRouterExtendPlugin, {VueRouter: VueRouter}]]);

// vue模块：结束
