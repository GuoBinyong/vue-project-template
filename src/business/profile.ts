const urlUtils = by.parseUrl(location.href);


const  configObj = {
  /**
   * 项目启动时的url参数；
   */
  launchParams : Object.freeze(urlUtils.params || {}),
};



interface ShareData {
  launchParams:typeof urlUtils;
}

window.shareData = configObj;

