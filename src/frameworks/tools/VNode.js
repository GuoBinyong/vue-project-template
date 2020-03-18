//获取tag和name：开始

/**
 * 获取虚拟节点的 tag 和 name
 * @param vNode : VNode
 * @return {tag,name}
 */
export function getVNodeTagAndName(vNode){
  return getTagAndNameFrom(vNode,vNode.componentInstance);
}


/**
 * 获取 Vue 组件实例 的 tag 和 name
 * @param vueInst : VueComponent
 * @return {tag,name}
 */
export function getVueInstTagAndName(vueInst){
  return getTagAndNameFrom(vueInst.$vnode,vueInst);
}



/**
 * 从 虚拟节点vNode 和 其对应的 Vue实例 vueInst 上获取 tag 和 name
 * @param vNode : VNode
 * @param vueInst : VueComponent
 * @return {tag,name}
 */
export function getTagAndNameFrom(vNode,vueInst){
  var tagName = {};

  if (vNode) {

    var componentOptions = vNode.componentOptions;

    if (componentOptions) {
      tagName.tag = componentOptions.tag;
      var Ctor =  componentOptions.Ctor;
      tagName.name = Ctor.options.name || Ctor.extendOptions.name;
    }

    if (tagName.tag){
      return tagName;
    }

    var longTag = vNode.tag;
  }


  if (vueInst){
    tagName.tag = vueInst.$options._componentTag;

    if (tagName.tag){
      return tagName;
    }

    var uid = vueInst._uid;
    if (uid == undefined && longTag != undefined){
      var tagReg = new RegExp(`^.*-${uid}-`);
      tagName.tag = longTag.replace(tagReg,"");
    }

  }else {
    tagName.tag = longTag;
  }

  return tagName;

}





//获取tag和name：结束








/**
 * 获取虚拟节点的文本内容
 * @param vNode : VNode   虚拟节点
 * @param separator : string    子节点文本内容的分隔符；默认值： `,`
 * @return string     vNode 的文本内容
 */

export function getVNodeTextContent(vNode,separator) {
  let textContent = null;

  let elm = vNode.elm

  let vNodeChildren = vNode.children ;
  let compOptionsChildren = vNode.componentOptions && vNode.componentOptions.children ;
  let children = vNodeChildren || compOptionsChildren ;

  if (elm){
    textContent = elm.innerText ;
  }else if (children) {

    let textContentList = children.map(function (childVNode) {
      return getVNodeTextContent(childVNode," ");
    });

    textContent = textContentList.join(separator);
  } else {
    textContent = vNode.text ;
  }


  return textContent ;
}






/**
 * 获取虚拟节点 及其 子节点中的第一个 click事件处理器 或 to 或 link
 * @param vNode
 * @return function
 */
export function getVNodeClickHandle (vNode){

  let click = null;

  let componentOptions = vNode.componentOptions ;

  if (componentOptions) {
    click = componentOptions.listeners && componentOptions.listeners.click ;

    if (!click) {
      click = componentOptions.propsData && componentOptions.propsData.to ;
    }

    if (!click) {
      click = componentOptions.propsData && componentOptions.propsData.link ;
    }

  }

  if (!click) {
    let vnData = vNode.data ;
    click = vnData && vnData.on && vnData.on.click ;
  }




  if (!click && vNode.children){
    vNode.children.find(function (childVNode) {
      click = getVNodeClickHandle(childVNode);
      return click ? true : false ;
    });
  }

  return click ;
}


/**
 * 从 虚拟节点 上解析出 ButtonOptions
 * @param vNode : VNode 虚拟节点
 * @return ButtonOptions
 *
 *
 * ButtonOptions 类型的定义是 :
 * ButtonOptions = {text:string,click:function}
 */
export function parseButtonOptionsFromVNode(vNode){
  let text = getVNodeTextContent(vNode," ");
  let click = getVNodeClickHandle(vNode) ;

  return {
    text:text,
    click:click
  };
}





/**
 * 从 虚拟节点列表 上解析出 ButtonOptions 列表
 * @param vNodeList : Array<VNode> 虚拟节点列表
 * @return Array<ButtonOptions>
 *
 *
 * ButtonOptions 类型的定义是 :
 * ButtonOptions = {text:string,click:function}
 */
export function parseButtonOptionsListFromVNodeList(vNodeList){
  return vNodeList.map(function (vNode) {
    return parseButtonOptionsFromVNode(vNode);
  });
}






//克隆结点：开始






/**
 * 通过创建新节点的方式 克隆 vnode
 * @param vnode : VNode
 * @param createElement : function     创建元素的函数
 * @param options ? : Object   可选的其它参数
 * @param options.data ? : Object     可选；一个包含模板相关属性的数据对象；这样，您可以在 template 中使用这些属性。可选参数。
 * @param options.resetDate ? : boolean    可选；默认值：false ； 是否要重置 data ，当值为 false 时，会将 options.data 与 原 vnode 的数据混合，原 vnode 中重复的 data 属性会被覆盖；当值为 true 时，如果 options.data 被设置，则会使用 options.data ，如果 options.data 没有被设置，则会使用 原 vnode 中的 data
 * @param options.children ? : Array<VNode>     可选；子节点 (VNodes)数组
 * @param options.deepClone ? : boolean    可选； 是否进行深度克隆
 * @return VNode    返回克隆的节点
 */
export function cloneVNodeUseCreate (vnode,createElement,options = {}) {
  let {data,children,deepClone,resetDate} = options ;

  let {children:vnChildren,componentOptions,data:vnData} = vnode ;

  let tagName = getVNodeTagAndName(vnode) ;
  let finalTag = tagName.tag || tagName.name;

  let oriChildren = vnChildren ;

  if (componentOptions) {
    let {propsData,listeners,children:comChildren} = componentOptions ;

    let {on,props,...pureVnData} = vnData ;
    let mergedProps = {...props,...propsData} ;
    let mergedOn = {...on,...listeners} ;

    vnData = {...pureVnData,props:mergedProps,on:mergedOn};

    oriChildren = comChildren || vnChildren ;
  }

  let finalData = null ;
  if (resetDate) {
    finalData = data || vnData ;
  }else {
    finalData = Object.assign(vnData,data);
  }




  let finalChildren = children ;


  if (!finalChildren && oriChildren){

    if (deepClone) {
      finalChildren = oriChildren.map( function(childVN){
        return cloneVNodeUseCreate(childVN,createElement,{deepClone:deepClone}) ;
      });
    }else {
      finalChildren = oriChildren ;
    }

  }




  const newVN = createElement(finalTag, finalData, finalChildren);



  const clonedVN = {...vnode};

  let ignoreKeys = ["isComment","text","componentOptions"];

  Object.keys(newVN).reduce(function (cloned,vnKey) {
    let vnValue = newVN[vnKey];

    if (!(vnValue == null || ignoreKeys.includes(vnKey) )) {
      cloned[vnKey] = vnValue ;
    }

    return cloned

  },clonedVN);





  return clonedVN;
}







/**
 * 通过创建新节点的方式克隆一组虚拟节点 vnode
 * @param vnodes : Array<VNode>     虚拟节点数组
 * @param createElement : function     创建元素的函数
 * @param options ? : Object   可选的其它参数
 * @param options.data ? : Object     可选；一个包含模板相关属性的数据对象；这样，您可以在 template 中使用这些属性。可选参数。
 * @param options.resetDate ? : boolean    可选；默认值：false ； 是否要重置 data ，当值为 false 时，会将 options.data 与 原 vnode 的数据混合，原 vnode 中重复的 data 属性会被覆盖；当值为 true 时，如果 options.data 被设置，则会使用 options.data ，如果 options.data 没有被设置，则会使用 原 vnode 中的 data
 * @param options.children ? : Array<VNode>     可选；子节点 (VNodes)数组
 * @param options.deepClone ? : boolean    可选； 是否进行深度克隆
 * @return VNode    返回克隆的节点
 */
export function cloneVNodesUseCreate (vnodes,createElement,options) {

  let newVNodes = [] ;

  if (vnodes) {
    newVNodes = vnodes.map(function (vn) {
      return cloneVNodeUseCreate(vn,createElement,options);
    });
  }

  return newVNodes ;

}











/**
 * 配置目标节点的上下文使之与源节点的上下文相同
 * @param targetVN : VNode    目标节点
 * @param sourceVN : VNode    源节点
 * @return VNode    修改后的目标节点
 */
export function configSameVnodeContext(targetVN,sourceVN){

  let relatedKeys = ["ns","fnContext","context"];

  relatedKeys.forEach(function (key) {
    targetVN[key] = sourceVN[key] ;
  });

  return targetVN;
}





/**
 * 通过复制的方法克隆节点
 * @param vnode : VNode   被克隆的节点
 * @param options : Object    选项对象
 * @opetions.equivalentVNode : VNode    提供等效上下文的节点
 * @opetions.deepClone : boolean    是否要进行深度克隆
 *
 * @return VNode
 */
export function cloneVNodeUseCopy(vnode,options = {}){
  let {equivalentVNode,deepClone} = options ;

  let clonedVN = {...vnode} ;

  if (equivalentVNode) {
    clonedVN = configSameVnodeContext(clonedVN,equivalentVNode);
  }


  if (deepClone) {

    let vnChildren = vnode.children ;

    if  (vnChildren) {
      clonedVN.children = vnChildren.map(function (childVN) {
        return cloneVNodeUseCopy(childVN,{deepClone:deepClone});
      });
    }


    let comChildren = vnode.componentOptions && vnode.componentOptions.children ;

    if (comChildren) {
      clonedVN.componentOptions.children = comChildren.map(function (childVN) {
        return cloneVNodeUseCopy(childVN,{deepClone:deepClone});
      });
    }


  }


  return clonedVN ;


}


/**
 * 通过复制的方法克隆一组节点
 * @param options : Object    选项对象
 * @opetions.equivalentVNode : VNode    提供等效上下文的节点
 * @opetions.deepClone : boolean    是否要进行深度克隆
 *
 * @return Array<VNode>
 */
export function cloneVNodesUseCopy(vnodes,options) {

  let clonedVnodes = [];

  if (vnodes) {
    clonedVnodes = vnodes.map(function (vn) {
      return cloneVNodeUseCopy(vn,options);
    });
  }

  return clonedVnodes;
}



//克隆结点：结束







//配置节点：开始

/**
 * 合并vue的 class 或者 style
 * @param item : VueClassObject | VueStyleObject     被合并的项目
 * @returns Array<VueClassObject | VueStyleObject>    合并后的数组
 */
export function mergeClassOrStyle(...items){

  let merged = items.reduce(function(total, item){

    if (item != undefined) {
      if (Array.isArray(item)) {
        total = total.concat(item);
      } else {
        total.push(item);
      }
    }

    return total;

  }, []);

  return merged ;
}










/**
 * 给虚拟节点配置模板数据
 * @param vnodes : VNodes    虚拟节点
 * @param tempData : TemplateData    模板数据
 * @returns VNodes     配置好模板数据的虚拟节点
 */




/*

TemplateData 的结构和含义如下：
注意：目前支持 TemplateData 配置有：props,class,style, attrs，on，key, slot 等等

{
  // 和`v-bind:class`一样的 API
  // 接收一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  // 接收一个字符串、对象或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽格式
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中向多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}
 */
export function configTemplateDataForVNodes(vnodes,tempData) {
  let {props:tmProps,"class":tmClass,style:tmStyle, attrs:tmAttrs, ...otherTmData} = tempData ;

  let vnData = vnodes.data || {} ;
  let {"class":vnClass, staticClass:vnStaticClass, style:vnStyle, staticStyle:vnStaticStyle, attrs:vnAttrs, ...otherVnData} = vnData ;


  let finalClass = mergeClassOrStyle(vnStaticClass,vnClass,tmClass);
  let finalStyle = mergeClassOrStyle(vnStaticStyle,vnStyle,tmStyle);

  let finalData = {...otherVnData,...otherTmData};

  if (finalClass.length > 0) {
    finalData.class = finalClass ;
  }

  if (finalStyle.length > 0) {
    finalData.style = finalStyle ;
  }


  let finalAttrs = {...vnAttrs,...tmAttrs} ;

  let componentOptions = vnodes.componentOptions ;
  if  (componentOptions){
    let vnProps = componentOptions.propsData ;
    let finalProps = {...vnProps,...tmProps};

    vnodes.componentOptions.propsData = finalProps ;
  }else {
    Object.assign(finalAttrs,tmProps);
  }


  if (!finalAttrs.noKeys) {
    finalData.attrs = finalAttrs ;
  }




  if (!finalData.noKeys) {
    vnodes.data = finalData ;
  }


  return vnodes;
}



//配置节点：结束




//vue实例操作：开始

/**
 * forceRecreateSiblingsOfVueInst(vueInst)
 * 强制销毁 并 重新创建 vueInst 及其 父组件的所有子组件；
 * 注意：
 * - 当 vueInst 是最顶层的 vue 实例时，只会强制 更新 $forceUpdate  vue组件实例 vueInst，不会重新创建 vueInst，但会使 vueInst 组件的所有子节点销毁并重新创建
 * - 抽像组件 的子组件的父组件并不是 该 组件 自己，而是 该组件的父组件；比如：keep-alive
 * @param vueInst : VueComponent
 */
export function forceRecreateSiblingsOfVueInst(vueInst){
  var parent = vueInst.$parent || vueInst;
  forceRemoveChildrenOfVueInst(parent);
  parent.$forceUpdate();
}


/**
 * forceRemoveSiblingsOfVueInst(vueInst)
 * 强制 移除 vueInst 及其 父组件的所有子组件；
 * 注意：
 * - 当 vueInst 是最顶层的 vue 实例时，只移除 vueInst 组件的所有子节点
 * - 抽像组件 的子组件的父组件并不是 该 组件 自己，而是 该组件的父组件；比如：keep-alive
 * @param vueInst : VueComponent
 */
export function forceRemoveSiblingsOfVueInst(vueInst){
  var parent = vueInst.$parent || vueInst;
  forceRemoveChildrenOfVueInst(parent);
}


/**
 * forceRemoveChildrenOfVueInst(vueInst)
 * 强制 移除 vueInst 的所有子组件；
 * 注意：
 * - 抽像组件 的子组件的父组件并不是 该 组件 自己，而是 该组件的父组件；所以 抽像组件的 $children 为 空数组 ；比如：keep-alive
 * @param vueInst : VueComponent
 */
export function forceRemoveChildrenOfVueInst(vueInst){
  var children = vueInst.$children || [];
  children.forEach(function (vInst) {
    vInst.$destroy();
  });
  vueInst._vnode = undefined;
}


/**
 * 刷新Vue实例的钩子，仅仅是依次调用 vue 实例的以下生命周期 钩子 ["beforeCreate","created","beforeMount","mounted"]
 * @param vueInst
 * @param incActivated ?: boolean 可选；默认值：false；是否包含 vue 的 activated 生命周期
 */
export function refreshVueInstHooks(vueInst,incActivated) {
  var hooks = ["beforeCreate","created","beforeMount","mounted"];
  if (incActivated){
    hooks.push("activated");
  }
  callVueHooks(vueInst,hooks);
}



/**
 * 一次调用Vue实例的多个生命周期钩子函数
 * @param vueInst
 * @param hooks : string | [string]   钩子的名字 或 名字列表
 */
export function callVueHooks (vueInst, hooks) {
  if (!Array.isArray(hooks)){
    hooks = [hooks];
  }

  hooks.forEach(function (hook) {
    callVueHook(vueInst,hook);
  });

}



/**
 * 调用Vue实例的生命周期钩子函数
 * @param vueInst
 * @param hook : string   钩子的名字
 */
export function callVueHook (vueInst, hook) {
  var handlers = vueInst.$options[hook];
  if (handlers) {
    handlers.forEach(function (handle) {
      handle.call(vueInst);
    });
  }
  if (vueInst._hasHookEvent) {
    vueInst.$emit('hook:' + hook);
  }
}







/**
 * 刷新Vue实例；
 * 该方法会先销毁 vueInst 然后再执行初始化和挂载操作；
 * 注意：
 * 该方法并不会新创建一个 vueInst ,而是继续用 传入的 vueInst 对象；
 *
 * @param vueInst
 * @param incActivated ?: boolean 可选；默认值：false；是否包含 vue 的 activated 生命周期
 */
export function forceRefreshVueInst(vueInst,incActivated) {
  vueInst.$destroy();
  reinitVueInst(vueInst,incActivated);
}




/**
 * 重新初始化Vue实例；
 * 该方法会直接执行初始化和挂载操作；
 * 注意：
 * 该方法并不会新创建一个 vueInst ,而是继续用 传入的 vueInst 对象；
 *
 * @param vueInst
 * @param incActivated ?: boolean 可选；默认值：false；是否包含 vue 的 activated 生命周期



 知识点：
 - 如果给 vueInst._init(options) 传的参数中配置的有 el 选项，则 _init() 方法会用 el 的值 自动调用 vueInst.$mount(options.el)
 - 对已存在的 vueInst 调用 vueInst.$mount(el) ，会触发挂载操作，并且会自动调用 vueInst 的 beforeMount 生命周期钩子，但不会调用 vueInst 的 mounted 和 activated 钩子；
 - 经研究，发现：vueInst 调用 mounted 的条件是 vueInst.$vnode == null ；
 - 但是 即使把 vueInst.$vnode 和  vueInst._vnode 都设置为 null，在执行到 vueInst.$vnode == null  判断时，vueInst.$vnode 也又有了值；所以，即使在调用 vueInst.$mount(el) 之前 把 vueInst.$vnode 和  vueInst._vnode 都设置为 null，也不会触发 mounted 钩子；
 - 为了简单实现，我们可以在 vueInst.$mount(el) 之后，手动调用 mounted 钩子；

 */
export function reinitVueInst(vueInst,incActivated) {
  vueInst._init(vueInst.$options);

  if (vueInst.$el){
    vueInst.$mount(vueInst.$el);

    var hooks = ["mounted"];
    if (incActivated){
      hooks.push("activated");
    }
    callVueHooks(vueInst,hooks);
  }

}







//vue实例操作：结束
