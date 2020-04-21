import VConsole from "vconsole"


// 是否允许调试模式开启
if (process.env.debug.allow) {


  /**
   * 给 window 对象 添加计算属性 byDebug ，用于存储共享的数据 ，当访问 byDebug 时，如果 byDebug 不存在，则会取创建
   */
  Object.defineProperty(window, 'byDebug', {
    get: function () {
      let _this = this || window ;
      if (!_this._byDebug) {
        _this._byDebug = {};
      }
      return _this._byDebug;
    }
  });


  /**
   * 远程调试
   */

  let weinreStart = function (weinreDomain) {
    weinreDomain = weinreDomain || process.env.weinreDomain;
    let weinreTarget = document.createElement("script");
    let scriptSrc = `http://${weinreDomain}/target/target-script-min.js#anonymous`;
    weinreTarget.setAttribute("src", scriptSrc);
    document.body.appendChild(weinreTarget)
  };

  if (process.env.debug.weinre.compileStart) {
    weinreStart();
  }

  if (process.env.debug.weinre.manualStart) {

    byDebug.weinreStart = weinreStart;

  }


  /**
   * vConsole调试
   */
  let vcCompileStart = process.env.debug.vConsole.compileStart;
  let vcManualStart = process.env.debug.vConsole.manualStart

  // if (vcCompileStart ||vcManualStart ) {
  //   import( /* webpackChunkName: "vconsole" */ 'vconsole').then(function (VConsole) {  //动态引用

      if (vcCompileStart) {
        byDebug.vConsole = new VConsole();
      }

      if (vcManualStart) {
        byDebug.VConsole = VConsole;
        byDebug.vConsoleStart = function (option) {
          byDebug.vConsole = new byDebug.VConsole(option);
        }
      }

  //   });
  // }


  /**
   * wechat 调试模式
   */
  if (process.env.debug.wechat) {
    byDebug.wechat = true;
  }


}
