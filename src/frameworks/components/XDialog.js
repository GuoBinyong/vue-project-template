/**
 * 解决vux带遮罩组件的遮罩下面东西可交互的问题
 *
 * 解决方案：
 * 对遮罩的 touchmove 事件阻止默认操作 和 冒泡
 *
 *
 * 由于以下组件是用  XDialog 实现的，所以解决 XDialog 的问题也就解决了以下组件的问题
 * - Alert
 * - Confirm
 */



import {XDialog} from 'vux';



//XDialog：开始

/**
 * 给 XDialog 增加了以下 prop
 * disContentBox : boolean   表示是否也禁止内容盒的 Touchmove 默认操作
 */


/**
 * 阻止元素 Touchmove 事件的默认操作的事件监听器
 * @param event
 */
function preventDefaultEventListener(event) {
  event.preventDefault();
  event.stopPropagation();
}


/**
 * 阻止元素 Touchmove 事件的默认操作
 * @param selector : string     被阻止 touchmove 事件默认操作的元素的选择器
 */
function preventDefaultForTouchmoveOfElements(selector){
  setTimeout(function () {
    var maskDomList = document.querySelectorAll(selector);
    maskDomList.forEach(function (maskDom) {
      // maskDom.removeEventListener("touchmove",preventDefaultEventListener);
      maskDom.addEventListener("touchmove",preventDefaultEventListener);
    });

  },0);
}



let formatObjects = [{separator:"-",caseType:"L"},{separator:"-",caseType:"U"},{separator:"-",caseType:"N"},{caseType:"N"}];


let disableBackgroundTouchMixin = {
  mounted:function () {
    let selector = ".vux-x-dialog>.weui-mask";
    let disContentBox = this.$attrs.findValueForKeyFormats("disContentBox",formatObjects);
    if (disContentBox){
      selector += ",.vux-x-dialog>.weui-dialog"
    }
    preventDefaultForTouchmoveOfElements(selector);
  }
};


let xDialogMixins = XDialog.mixins || [];
xDialogMixins = xDialogMixins.concat(disableBackgroundTouchMixin);
XDialog.mixins = xDialogMixins;

//XDialog：开始
