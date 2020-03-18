//元素位置距离：开始


/**
 * 计算元素相对指定的祖先节点 parentNode 的偏移量
 * @param parentNode : Element  祖先节点
 * @return {x:number,y:number,left:number,top:number}   x、leftL: 水平方向的偏移量；y、top : 垂直方向的偏移量；
 */
Element.prototype.scrollDistanceFromParent = function (parentNode) {
  var top = this.scrollTop;
  var left = this.scrollLeft;

  var nextNode = this.parentNode;

  while (!parentNode.isSameNode(nextNode)) {
    top += nextNode.scrollTop;
    left += nextNode.scrollLeft;
    nextNode = nextNode.parentNode;
  }

  return {x: left,y: top, left: left, top: top };
}






/**
 * 计算元素相对文档的偏移量
 * @return {x:number,y:number,left:number,top:number}   x、leftL: 水平方向的偏移量；y、top : 垂直方向的偏移量；
 */
Element.prototype.offsetFromDocument = function () {
  var top = this.offsetTop;
  var left = this.offsetLeft;

  var nextNode = this.offsetParent;

  while (nextNode) {
    top += nextNode.offsetTop;
    left += nextNode.offsetLeft;
    nextNode = nextNode.offsetParent;
  }

  return {x: left,y: top, left: left, top: top };
}






/**
 * 计算指定元素相对于当前元素之间的可视的距离坐标
 * @param toDom : Element  指定元素
 * @return {x:number,y:number,left:number,top:number}  x、leftL: 水平方向的的距离；y、top : 垂直方向的距离；
 */
Element.prototype.distanceToDom = function (toDom) {

  var fromRect = this.getBoundingClientRect();
  var toRect = toDom.getBoundingClientRect();

  var x = toRect.left - fromRect.left;
  var y = toRect.top - fromRect.top;

  return {x: x,y: y,left: x,top: y};
}


//元素位置距离：结束









//元素行字数：开始

let propertyDescriptors = {


  /**
   * isVertical : boolean  表示元素的内容是否是垂直方向排列
   */
  isVertical: {
    enumerable:false,
    get:function(){
      var compStyle = window.getComputedStyle(this);
      var writingMode =  compStyle.writingMode;

      var isVer = false;
      switch (writingMode) {
        case "vertical-rl":
        case "vertical-lr":
        case "tb-rl":{
          isVer = true;
          break;
        }
      }

      return isVer;
    }
  },


  /**
   * computedLineHeight : number  返回元素的计算后的行高
   */
  computedLineHeight:{
    enumerable:false,
    get:function(){
      var compStyle = window.getComputedStyle(this);
      var lineHeight =  parseFloat(compStyle.lineHeight);

      if (isNaN(lineHeight)) {
        var fontSize = parseFloat(compStyle.fontSize);
        lineHeight = fontSize * 1.2 ;
      }

      return lineHeight;
    }

  },


  /**
   * contentHeight : number   元素内容区域的高度
   */
  contentHeight: {
    enumerable: false,
    get: function(){
      var compStyle = window.getComputedStyle(this);
      var clientHeight = this.clientHeight;
      var paddingTop =  parseFloat(compStyle.paddingTop);
      var paddingBottom =  parseFloat(compStyle.paddingBottom);

      return clientHeight - paddingTop - paddingBottom;
    }

  },

  /**
   * contentWidth : number   元素内容区域的宽度
   */
  contentWidth: {
    enumerable: false,
    get: function(){
      var compStyle = window.getComputedStyle(this);
      var clientWidth = this.clientWidth;
      var paddingLeft =  parseFloat(compStyle.paddingLeft);
      var paddingRight =  parseFloat(compStyle.paddingRight);

      return clientWidth - paddingLeft - paddingRight;
    }

  },



  /**
   * scrollContentHeight : number   元素的滑动内容区域的高度
   */
  scrollContentHeight: {
    enumerable: false,
    get: function(){
      var compStyle = window.getComputedStyle(this);
      var scrollHeight = this.scrollHeight;
      var paddingTop =  parseFloat(compStyle.paddingTop);
      var paddingBottom =  parseFloat(compStyle.paddingBottom);

      return scrollHeight - paddingTop - paddingBottom;
    }

  },



  /**
   * scrollContentWidth : number   元素的滑动内容区域的宽度
   */
  scrollContentWidth: {
    enumerable: false,
    get: function(){
      var compStyle = window.getComputedStyle(this);
      var scrollWidth = this.scrollWidth;
      var paddingTop =  parseFloat(compStyle.paddingTop);
      var paddingBottom =  parseFloat(compStyle.paddingBottom);

      return scrollWidth - paddingTop - paddingBottom;
    }

  },




  /**
   * numberOfLinesOnClient : number  返回能在元素的 client 中能显示文字的最大行数
   */
  numberOfLinesOnClient: {
    enumerable: false,
    get: function () {
      var length = this.isVertical ? this.contentWidth : this.contentHeight ;
      return length / (this.computedLineHeight);
    }

  },


  /**
   * numberOfCharsPerLineOnClient : number  返回能在元素的 client 中每行能显示文字的最大字数
   */
  numberOfCharsPerLineOnClient: {
    enumerable: false,
    get: function () {
      var compStyle = window.getComputedStyle(this);
      var fontSize = parseFloat(compStyle.fontSize);

      var length = this.isVertical ? this.contentHeight : this.contentWidth ;
      return length / fontSize;
    }

  },



  /**
   * numberOfCharsOnClient : number  返回能在元素的 client 中能显示文字的最大字数
   * 注意：
   * 该值是 对 numberOfLinesOnClient 和 numberOfCharsPerLineOnClient 四舍五入后的乘积
   */
  numberOfCharsOnClient: {
    enumerable: false,
    get: function () {
      var roundLineNum = Math.round(this.numberOfLinesOnClient);
      var roundCharNum = Math.round(this.numberOfCharsPerLineOnClient);

      return roundLineNum * roundCharNum;
    }

  },




  /**
   * numberOfLinesOnScroll : number  返回能在元素的 滑动区域 中能显示文字的最大行数
   */
  numberOfLinesOnScroll: {
    enumerable: false,
    get: function () {
      var length = this.isVertical ? this.scrollContentWidth : this.scrollContentHeight ;
      return length / (this.computedLineHeight);
    }

  },


  /**
   * numberOfCharsPerLineOnScroll : number  返回能在元素的  滑动区域 中每行能显示文字的最大字数
   */
  numberOfCharsPerLineOnScroll: {
    enumerable: false,
    get: function () {
      var compStyle = window.getComputedStyle(this);
      var fontSize = parseFloat(compStyle.fontSize);
      var length = this.isVertical ? this.scrollContentHeight : this.scrollContentWidth ;
      return length / fontSize;
    }

  },




  /**
   * numberOfCharsOnClient : number  返回能在元素的 滑动区域 中能显示文字的最大字数
   * 注意：
   * 该值是 对 numberOfLinesOnScroll 和 numberOfCharsPerLineOnScroll 四舍五入后的乘积
   */
  numberOfCharsOnScroll: {
    enumerable: false,
    get: function () {
      var roundLineNum = Math.round(this.numberOfLinesOnScroll);
      var roundCharNum = Math.round(this.numberOfCharsPerLineOnScroll);

      return roundLineNum * roundCharNum;
    }

  },

};



Object.defineProperties(Element.prototype,propertyDescriptors);







/**
 * calcClientLengthOfLines(lineNumber)
 * 计算刚好容纳指定的 行数 时 元素的尺寸
 * @param lineNumber : number  行数
 */
Element.prototype.calcClientLengthOfLines = function (lineNumber) {

  var isVisible = this.isVisible ;
  var length = 0;

  if (lineNumber == undefined) {
    return {length:length, visible:isVisible} ;
  }



  length = this.computedLineHeight * lineNumber;


  var compStyle = window.getComputedStyle(this);
  var boxSizing = compStyle.boxSizing;
  var isBorderBox = boxSizing == "border-box" ;


  if (isBorderBox) {

    if (isVisible) {
      var paddingLeft = parseFloat(compStyle.paddingLeft);
      var paddingRight = parseFloat(compStyle.paddingRight);
      length = length + paddingLeft + paddingRight ;
    }else {
      var paddingTop = parseFloat(compStyle.paddingTop);
      var paddingBottom = parseFloat(compStyle.paddingBottom);
      length = length + paddingTop + paddingBottom ;
    }

  }

  return {length:length, visible:isVisible} ;

}







/**
 * setNumberOfLines(lineNumber)
 * 给元素设置相应的尺寸以使能刚好容纳指定的 行数
 * @param lineNumber : number | undefined | null    行数 ; 当值为 undefined | null 时，清除之前关于行数的设置
 */
Element.prototype.setNumberOfLines = function (lineNumber) {

  var lengthInfo = this.calcClientLengthOfLines(lineNumber);
  var isVisible = lengthInfo.visible ;
  var lineLength = lengthInfo.length ;

  if (lineNumber == undefined) { //如果没传任何值；则清除相关的内联样式

    if (isVisible) {
      this.style.width = null ;
    }else {
      this.style.height = null ;
    }

    return
  }


  var lengthStyle =  lineLength + "px" ;

  if (isVisible) {
    this.style.width = lengthStyle ;

  }else {
    this.style.height = lengthStyle ;
  }


}






/**
 * setNumberOfChars(charNumber)
 * 给元素设置相应的尺寸以使每行能刚好容纳指定的 字数
 * @param charNumber : number | undefined | null    字数 ; 当值为 undefined | null 时，清除之前关于字数的设置
 */
Element.prototype.setNumberOfChars = function (charNumber) {

  var isVisible = this.isVisible ;

  if (charNumber == undefined) { //如果没传任何值；则清除相关的内联样式

    if (isVisible) {
      this.style.height = null ;
    }else {
      this.style.width = null ;
    }
    return
  }


  var charLength = charNumber + "em";


  var compStyle = window.getComputedStyle(this);
  var boxSizing = compStyle.boxSizing;
  var isBorderBox = boxSizing == "border-box" ;



  if (isVisible) {

    if (isBorderBox) {

      var paddingTop = compStyle.paddingTop;
      var paddingBottom = compStyle.paddingBottom;

      charLength = "calc( " + charLength + " + " + paddingTop + " + " + paddingBottom + " )" ;
    }

    this.style.height = charLength ;


  }else {

    if (isBorderBox) {

      var paddingLeft = compStyle.paddingLeft;
      var paddingRight = compStyle.paddingRight;

      charLength = "calc( " + charLength + " + " + paddingLeft + " + " + paddingRight + " )" ;
    }

    this.style.width = charLength ;

  }


}








/**
 * setNumberOfLinesAndChars(lineNumber,charNumber)
 * @param lineNumber : number | undefined | null    行数 ; 当值为 undefined | null 时，清除之前关于行数的设置
 * @param charNumber : number | undefined | null    字数 ; 当值为 undefined | null 时，清除之前关于字数的设置
 */
Element.prototype.setNumberOfLinesAndChars = function (lineNumber,charNumber) {
  this.setNumberOfLines(lineNumber);
  this.setNumberOfChars(charNumber);
}



//元素行字数：结束






/**
 * elementIsMatchSelector(element,selector,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 element
 * 或者可以理解为：
 * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
 * @param element : Element   被测试的元素
 * @param selector : string   css 选择器
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 */
 window.elementIsMatchSelector =  function elementIsMatchSelector(element,selector,parentNode) {
  if (!parentNode) {
    parentNode = document;
  }

  if (!parentNode.contains(element)){
     return false;
  }

  var elemList =  parentNode.querySelectorAll(selector);
  var elemArray = Array.from(elemList);
  return elemArray.some(function(qsElem){
    return element.isSameNode(qsElem);
  });

};




/**
 * isMatchSelector(selector,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
 * 或者可以理解为：
 * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
 * @param selector : string   css 选择器
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 */
Element.prototype.isMatchSelector = function isMatchSelector(selector,parentNode) {
  return elementIsMatchSelector(this,selector,parentNode)
};






/**
 * elementIsMatchOption(element,option,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含元素 element
 * 或者可以理解为：
 * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
 * @param element : Element   被测试的元素
 * @param option : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 *
 * 注意：
 * option的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
 * option 中可配置如下属性：
 * tag ? : string   可选； 元素的标签名字
 * id ? : string  可选； 元素的id
 * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string    可选；css选择器
 *
 */
window.elementIsMatchOption =  function elementIsMatchSelector(element,option,parentNode) {
  if (!parentNode) {
    parentNode = document;
  }

  if (typeof option == "string"){
    option = {selector:option};
  }

  return Object.keys(option).every(function (key) {
    var value = option[key];
    var keyMatch = true;
    switch (key) {

      case "tag":{
        if (value){
          value = value.toLowerCase();
        }
        keyMatch = element.localName == value && element.tagName.toLowerCase() == value;
        break
      }

      case "id":{
        keyMatch = element.id == value;
        break
      }

      case "class":{

        if (Array.isArray(value)) {
          var classArr = Array.from(element.classList);
          keyMatch = classArr.isContains(value);

        }else {
          keyMatch = element.className == value;
        }

        break
      }


      case "selector":{
        keyMatch = element.isMatchSelector(value,parentNode);
        break
      }

    }


    return keyMatch;
  });
};






/**
 * isMatchOption(option,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含当前元素
 * 或者可以理解为：
 * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
 * @param option : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 *
 * 注意：
 * option的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
 * option 中可配置如下属性：
 * tag ? : string   可选； 元素的标签名字
 * id ? : string  可选； 元素的id
 * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string    可选；css选择器
 *
 */
Element.prototype.isMatchOption =  function isMatchOption(option,parentNode) {
  return elementIsMatchOption(this,option,parentNode);
};






/**
 * elementIsMatchSomeOptions(element,optionArr,parentNode)
 * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
 * @param element : Element   被测试的元素
 * @param optionArr : Array<Option>   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 *
 * 注意：
 * Option的各种配置项是且的关系，即：Option 中设置的所有配置项都匹配才算通过
 * Option 中可配置如下属性：
 * tag ? : string   可选； 元素的标签名字
 * id ? : string  可选； 元素的id
 * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string    可选；css选择器
 *
 */
window.elementIsMatchSomeOptions =  function elementIsMatchSomeOptions(element,optionArr,parentNode) {
  return optionArr.some(function (option) {
    return elementIsMatchOption(element,option,parentNode);
  });
};






/**
 * isMatchSomeOptions(optionArr,parentNode)
 * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
 * @param optionArr : Array<Option>   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 *
 * 注意：
 * Option的各种配置项是且的关系，即：Option 中设置的所有配置项都匹配才算通过
 * Option 中可配置如下属性：
 * tag ? : string   可选； 元素的标签名字
 * id ? : string  可选； 元素的id
 * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string    可选；css选择器
 *
 */
Element.prototype.isMatchSomeOptions =  function isMatchSomeOptions(optionArr,parentNode) {
  return elementIsMatchSomeOptions(this,optionArr,parentNode);
};






