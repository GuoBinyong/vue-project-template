/**
 * 接受一个键名和值作为参数，将会把键名添加到存储中，如果键名已存在，则更新其对应的值。
 *
 * @param keyName : DOMString  要创建或更新的键名
 * @param anyItem : any      要创建或更新的键名对应的值。
 * @param replacer ? : Function | Array<Function>   如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为null或者未提供，则对象所有的属性都会被序列化；
 * @param space ? : number | string    指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格；如果该参数没有提供（或者为null）将没有空格
 */
Storage.prototype.setAnyItem = function (keyName, anyItem, replacer, space) {
  let jsonStr = JSON.stringify(anyItem, replacer, space);
  this.setItem(keyName, jsonStr);
}


/**
 * 接受一个键名（key name）作为参数，并返回对应键名的值 。
 *
 * @param keyName : DOMString    一个包含键名的 DOMString。
 * @param reviver ? : Function    如果是一个函数，则规定了原始值如何被解析改造，在被返回之前。
 * @returns any
 */
Storage.prototype.getParsedItem = function (keyName, reviver) {
  let jsonStr = this.getItem(keyName);
  let item = JSON.correctParse(jsonStr, reviver);
  return item;
}
