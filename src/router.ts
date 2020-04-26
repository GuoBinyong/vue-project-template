import Vue from 'vue'
import Router from 'vue-router'
import {appChildRoutes} from ':app/config'




Vue.use(Router)



declare global {

  interface ShareInst {
    router:Router;
    routerReady:Promise<Router>;
  }

}



const router = new Router({
  routes: appChildRoutes
});

by.defineListenablePropertyGetter(window.shareInst,"router",function () {
  return router
});
window.shareInst.router = router;



// 设置路由数据 routeData 相关的配置;

//设置或者检查所有路由位置对象的属性名数组;
// router.locatPropsOfRouteData = ["to", "from", "back"];


/**
 * 设置特殊的路由位置
 * 目前用于：
 * - App 中在特殊位置时按设备的返回按钮会使App退出
 */
/*router.specialLocats = [
  {name:"Home"}
] ;*/


//设置路由的通过 store 存取路由数据的相关配置
/*router.setRouteDataMutation = "setRouteData";
router.getRouteDataFromStore = function (store, dataKey) {
  return store.state.route.data[dataKey];
};*/


/**
 * 登录授权
 * 注意：
 * 如果某个路由需要 登录，则只需要在其路由配置中的 meta 中 添加 needLogIn 字段，值为 true
 */
/*router.beforeEach(function (to, from, next) {
  //todo: 登录的meta字段
  let needLogIn = to.matched.some(function (record) {
    return record.meta.needLogIn
  });
  if (needLogIn) {

    if (router.app.$store.state.isLogIn) {
      next()
    } else {
      // fixme: 跳到登录页面
      next({
        name: 'LogIn',
        query: {next: to.fullPath}
      })
    }
  } else {
    next();
  }
});*/


// 加载状态启动
/*router.beforeEach(function (to, from, next) {
  //登录的meta字段
  let showLoading = to.matched.some(function (record) {
    return record.meta.showLoading
  });
  if (showLoading) {
    //  显示加载状态

  }
  next();
});*/

// 加载状态关闭
/*router.afterEach(function (to, from) {
  // 登录的meta字段
  let showLoading = to.matched.some(function (record) {
    return record.meta.showLoading
  });
  if (showLoading) {
    //  关闭加载状态
  }
});*/


export default router
