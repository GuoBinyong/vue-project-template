import Vue from 'vue';
import {getVNodeTagAndName} from './VNode'

/**
 * listenVueSwitch()
 * 执行该函数，监听vue组件的激活和失活状态的改变
 *
 *
 * 该函数对象提供了以下属性供配置：
 * parentNames ?: string | [string]   可选；设置被监听的组件的父组件的标签名字；如果配置了该属性，则只有当组件的父组件包含在该配置里时，才会执行相应的 action;  否则，不会对其父组件做验证；
 * activate ?: Action | [Action]    可选；当组件被激活时需要执行的操作 或 一组操作的 数组
 * deactivate ?: Action | [Action]    可选；当组件失活时需要执行的操作 或 一组操作的 数组
 * switch ?: Action | [Action]    可选；当组件激活或失活时需要执行的操作 或 一组操作的 数组
 *
 * Action 类型定义如下
 * Action = (alive:boolean,vueInst:VueComponent,parentInst:VueComponent)=>Void
 * */
export default function listenVueSwitch() {


  /*
  监听激活和失活的混合
  如果祖选组件中存在 keep-alive 组件，则通过 mounted 和 beforeDestroy 来监听激活和失活是失效的，这时需要 通过 activated 和 deactivated；
  注意：已经做了防止调用两次回调的逻辑
  * */
  let switchMixin = {
    mounted:activatedHandle,
    activated:activatedHandle,

    deactivated:deactivatedHandle,
    beforeDestroy:deactivatedHandle
  };


  Vue.mixin(switchMixin);
}





/**
 * 激活的回调函数
 */
function activatedHandle(){
  if(this._haveActivated){
    this._haveActivated = false;
    return;
  }
  this._haveActivated = true;
  performActions(this,true);
}


/**
 * 失活的回调函数
 */
function deactivatedHandle () {
  if(this._haveDeactivated){
    this._haveDeactivated = false;
    return;
  }
  this._haveDeactivated = true;
  performActions(this,false);
}




let propertyDescriptors = {
  /**
   * parentNames ?: string | [string]   可选；设置被监听的组件的父组件的标签名字；
   */
  parentNames:{
    get:function () {
      var _this = this || listenVueSwitch;
      return _this._parentNames
    },
    set:function (newValue) {
      var _this = this || listenVueSwitch;
      if (!newValue || Array.isArray(newValue)){
        _this._parentNames = newValue;
      }else {
        _this._parentNames = [newValue];
      }
    }
  },

  /**
   * activate ?: Action | [Action]    可选；当组件被激活时需要执行的操作 或 一组操作的 数组
   * Action = (alive:boolean,vueInst:VueComponent,parentInst:VueComponent)=>Void
   */
  activate:{
    get:function () {
      var _this = this || listenVueSwitch;
      return _this._activate;
    },
    set:function (newValue) {
      var _this = this || listenVueSwitch;
      if (!newValue || Array.isArray(newValue)){
        _this._activate = newValue;
      }else {
        _this._activate = [newValue];
      }
    }
  },

  /**
   * deactivate ?: Action | [Action]    可选；当组件失活时需要执行的操作 或 一组操作的 数组
   * Action = (alive:boolean,vueInst:VueComponent,parentInst:VueComponent)=>Void
   */
  deactivate:{
    get:function () {
      var _this = this || listenVueSwitch;
      return _this._deactivate;
    },
    set:function (newValue) {
      var _this = this || listenVueSwitch;
      if (!newValue || Array.isArray(newValue)){
        _this._deactivate = newValue;
      }else {
        _this._deactivate = [newValue];
      }
    }
  },

  /**
   * switch ?: Action | [Action]    可选；当组件激活或失活时需要执行的操作
   * Action = (alive:boolean,vueInst:VueComponent,parentInst:VueComponent)=>Void
   */
  switch:{
    get:function () {
      var _this = this || listenVueSwitch;
      return _this._switch;
    },
    set:function (newValue) {
      var _this = this || listenVueSwitch;
      if (!newValue || Array.isArray(newValue)){
        _this._switch = newValue;
      }else {
        _this._switch = [newValue];
      }
    }
  },


};


Object.defineProperties(listenVueSwitch, propertyDescriptors);






/**
 * 执行相关的 actions
 * @param vueInst : Vue   当前的Vue实例
 * @param alive : boolean  是否是激活
 */
function performActions(vueInst,alive){
  let  parentNameList = listenVueSwitch.parentNames || [];

  if (parentNameList.length>0) {
    var currVNode = vueInst.$vnode;

    if (!currVNode){
      return;
    }

    var parentVNode = currVNode.parent;

    if  (!parentVNode){
      return;
    }


    var tagAndName = getVNodeTagAndName(parentVNode);
    var parentName = tagAndName.tag || tagAndName.name;

    if (!parentNameList.includes(parentName)){
      return;
    }

    var parentInst = parentVNode.componentInstance;
  }


  var actions = alive ? listenVueSwitch.activate : listenVueSwitch.deactivate ;
  var switchActions = listenVueSwitch.switch;

  let allActions = [];
  if (actions){
    allActions = allActions.concat(actions);
  }

  if (switchActions){
    allActions = allActions.concat(switchActions);
  }


  if (allActions.length > 0) {
    allActions.forEach(function (action) {
      action.call(vueInst,alive,vueInst,parentInst);
    });
  }

}
