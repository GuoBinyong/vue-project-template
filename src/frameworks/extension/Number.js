


let propertyDescriptors = {



  /**
   * 接口1:
   * distanceSort(num1,num2 ,...)
   * 根据各个 num 在数轴上距 自己 远近来排序
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   *
   *
   * 接口2:
   * distanceSort(nums)
   * 根据 nums 各个数在数轴上距 自己 远近来排序
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   */
  distanceSort:{
    enumerable:false,
    value:function(...nums){
      return Math.distanceSort(this,...nums);
    }
  },



  /**
   * 接口1:
   * nearest(num1,num2 ,...)
   * 返回距 自己 最近的数
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   *
   *
   * 接口2:
   * nearest(nums)
   * 返回距 自己 最近的数
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   */
  nearest:{
    enumerable:false,
    value:function(...nums){
      return Math.nearest(this,...nums);
    }
  },




  /**
   * 接口1:
   * farthest(num1,num2 ,...)
   * 返回距 自己 最远的数
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   *
   *
   * 接口2:
   * farthest(nums)
   * 返回距 自己 最远的数
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
   */
  farthest:{
    enumerable:false,
    value:function(...nums){
      return Math.farthest(this,...nums);
    }
  },



};






Object.defineProperties(Number.prototype,propertyDescriptors);







//兼容：开始


if (!Number.isInteger) {
  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
}


//兼容：结束
