/**
 * isChildNodeOf(node)
 * 判断 当前节点 是否是 其它节点node 的 子节点 或 后代节点
 * @param node : Node    被检测的节点
 * @returns boolean
 */
Node.prototype.isChildNodeOf = function isChildNodeOf(node) {
  var parent = this.parentNode;
  if (parent){
    if (node.isSameNode(parent)) {
      return true;
    }else {
      return parent.isChildNodeOf(node);
    }
  } else {
    return false;
  }
}





/**
 * isChildElementOf(element)
 * 判断 当前元素 是否是 其它元素element 的 子元素 或 后代元素
 * @param element : Node    被检测的元素
 * @returns boolean
 */
Node.prototype.isChildElementOf = function isChildElementOf(element) {
  var parent = this.parentElement;
  if (parent){
    if (element.isSameNode(parent)) {
      return true;
    }else {
      return parent.isChildElementOf(element);
    }
  } else {
    return false;
  }
}




//兼容：开始


/**
 * contains(otherNode)
 * contains(otherNode) 返回的是一个布尔值，来表示传入的节点是否为该节点的后代节点。
 * @param otherNode : Node      是否是当前节点的后代节点.
 * @returns boolean     如果 otherNode 是 node 的后代节点或是 node 节点本身.则返回true , 否则返回 false.
 */
if (!Node.prototype.contains) {
  Node.prototype.contains = function contains(otherNode) {
    return this.isSameNode(otherNode) || otherNode.isChildNodeOf(this);
  }
}

//兼容：结束

