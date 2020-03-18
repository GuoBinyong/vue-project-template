import {Spinner} from "vux"
import Vue from 'vue'
import DisplayElementSwitch from "./DisplayElementSwitch"
import "./DisplayElementSwitch/style.css"
var SpinnerClass = Vue.extend(Spinner);


/**
 * 创建 顶部的 Spinner 版 DisplayElementSwitch 实例
 * @param options ?: {type:SpinnerType,ele: Ele | [Ele] }    可选；TopSpinnerDisplaySwitch 的配置选项；可配置的属性如下：
 * @property type ?: SpinnerType    可选；Spinner 的 默认类型；
 * @property ele ?: Ele | [Ele]    可选；默认值：document.body；  挂载 容器元素 container 的元素 ；如果是数组类型，则会优先使用第一个能查找到的 dom 元素来作为挂载元素，即：相当于备用挂载元素的列表
 *
 * Ele = Selector | Dom
 *
 * @return {DisplayElementSwitch}
 */
function createTopSpinnerDisplaySwitch(options) {
  var {type:defaultType,ele} = options || {};
  return  new DisplayElementSwitch({
    ele:ele,
    updateOptions:function (showOpts,container,desInst) {
      var type = showOpts && showOpts.type;

      var spinner = desInst.spinner;
      if (!spinner){
        spinner = new SpinnerClass({
          propsData:{type:type || defaultType},
        });
        let spinnerEle = document.createElement("div");
        container.appendChild(spinnerEle);

        desInst.spinnerEle = spinnerEle;
        desInst.spinner = spinner;

        spinner.$mount(spinnerEle);
      }

      if  (type && type != spinner.type){
        spinner.type = type;
        spinner.$mount(desInst.spinnerEle);
      }
    },

    getOffset:function (showOpts,container,desInst) {
      let viewBoxBodyList = document.querySelectorAll("#vux_view_box_body");
      let viewBoxBody = viewBoxBodyList[viewBoxBodyList.length - 1];

      if (viewBoxBody){
        let compStyle = window.getComputedStyle(viewBoxBody);
        return {top:compStyle.paddingTop};
      }

    }


  });
}


export default  createTopSpinnerDisplaySwitch ;
