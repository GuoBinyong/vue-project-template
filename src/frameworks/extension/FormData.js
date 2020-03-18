var fdPrototype = FormData.prototype



// 在较低版本的浏览器中(比如：IOS10中的Safari)，FormData 类只有一个实例方法 append ，在这种情况下，只能把 set 操作 当作 append 来用
if (!fdPrototype.set){
  fdPrototype.set = fdPrototype.append
}
