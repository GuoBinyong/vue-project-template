


/**
 * 本方法是用于解决ipnut输入框在触摸屏中不灵敏的问题，该问题的原因有以下两点（其中第一个原因是主要原因）：
 * 1. 触发input元素获取焦点的事件有延迟；
 * 2. input元素的响应范围较小；
 *
 * 解决方案：
 * 当input或其父元素上触发无延迟事件时，用代码让input元素获取焦点；
 * 经过测试，推荐用无延迟的事件有：touchstart、click 等
 *
 *
 * focusInputOnTargetOfEvent(targetTests,eventName,excludeInput)
 * 在 eventName事件触发在符合条件的目标元素上时，将焦点聚焦到该元素的后代元素中的 第一个input元素 或 目标元素本身（当目标元素是input元素时）
 * @param targetTests : Array< targetFun | ElementMatchOption>    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
 * @param eventName ? : string     可选；默认值："click"； 监听事件的名字
 * @param excludeInput ? :  boolean  可选；默认值：false ; 表示当点击的目标元素是input元素时，不做设置焦点的动作；即 排除目标元素是input的情况
 *
 *
 * targetFun : (targetElement)=>boolean   测试函数
 * elementMatchOption : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
 *
 * elementMatchOption的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
 * option 中可配置如下属性：
 * tag ? : string   可选； 元素的标签名字
 * id ? : string  可选； 元素的id
 * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string    可选；css选择器
 *
 */
window.focusInputOnTargetOfEvent = function focusInputOnTargetOfEvent(targetTests,eventName,excludeInput) {

  if (!Array.isArray(targetTests)) {
    targetTests = [targetTests];
  }

  if (!eventName){
    eventName = "click"
  }

  /**
   * 测试 testArr 中是否有 符合 target 的 test； 即
   * @param target
   * @param testArr
   * @returns boolean
   */
  function testTarget(target,testArr) {
    return testArr.some(function (test) {
      if (typeof test == "function") {
        return test(target);
      }else {
        return target.isMatchOption(test);
      }
    });
  }


  document.addEventListener(eventName,function (event) {

    var target = event.target;

    if (testTarget(target,targetTests)) {


      if (target.localName == "input") {

        if (!excludeInput) {
          target.focus();
        }

      }else {

        var inputDom = target.getElementsByTagName("input")[0];
        if (inputDom) {
          inputDom.focus();
        }

      }


    }

  });

}


