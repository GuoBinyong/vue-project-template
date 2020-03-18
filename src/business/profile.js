import {defineListenableProperties} from  ':tools/ByTool'

const urlUtils = parseUrl(location.href);

const  configObj = {
  /**
   * 项目启动时的url参数；
   */
  launchParams : Object.freeze(urlUtils.params || {}),
};


window.shareData = configObj;

//解决input元素不灵敏的问题
// focusInputOnTargetOfEvent([{"class":["vux-x-input"]},{selector:".vux-x-input>.weui-cell__bd"},{tag:"input"}])



defineListenableProperties(window.shareInst,["http","router","store","app"]);

//禁止当弹出键盘时 winodw 窗口改变高度
/* import {prohibitWindowHeightChangeWhenInput} from  ':tools/ByTool'
prohibitWindowHeightChangeWhenInput(); */
