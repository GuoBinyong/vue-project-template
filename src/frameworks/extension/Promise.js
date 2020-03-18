/**
 * createControllablePromise(executor ?:(resolve, reject)=>Void)
 * 创建外部可控制的改变 Promise 状态 Status 的 Promise 对象；该 Promise 对象在 状态 未完成之前，会 resolve、reject、clearAdditions 三个方法，当 Promise 的状态完成时，resolve、reject、clearAdditions 这三个方法会自动被删除；其中 clearAdditions 方法是用来 清除 该实例的 resolve、reject、clearAdditions 这三个方法的；
 *
 * @param executor ?: (resolve, reject)=>Void    可选；executor是带有 resolve 和 reject 两个参数的函数 。Promise构造函数执行时立即调用executor 函数，
 * @param statusCompletesImmediately ?: boolean   可选；默认值：true； 该参数表示在 executor 函数中是否会立即（同步）调用 resolve 或 reject ；如果是，则会把 executor 函数变成异步执行，以来避免在执行 clearAdditions 时引用 还未创建的 真实的 promise 实例；
 * @returns Promise   返回一个带有 resolve、reject 和 clearAdditions  三个方法的 Promise 实例，在该实例的 状态没有改变之前 ，通过 resolve 和 reject 这两个方法，可以改变 Promise 的状态，并且会自动调用 clearAdditions 方法来清除  resolve、reject、clearAdditions 这三个方法； clearAdditions 方法用来清除 resolve、reject 和 clearAdditions  这三个方法的
 */
window.createControllablePromise = function createControllablePromise(executor,statusCompletesImmediately) {
  let executorIsvalid = typeof executor == "function";
  if (executorIsvalid && statusCompletesImmediately == undefined){
    statusCompletesImmediately = true
  }


  var oriFuns = {};

  function clearAdditions() {
    caPromise.resolve = undefined;
    caPromise.reject = undefined;
    caPromise.clearAdditions = undefined;
  }

   function resolveFun(value) {
     clearAdditions();
     oriFuns.resolve(value);
   }

   function rejectFun(reason) {
     clearAdditions();
     oriFuns.reject(reason);
   }


  var caPromise = new Promise(function (resolve, reject) {
    oriFuns.resolve = resolve;
    oriFuns.reject = reject;
    if (executorIsvalid) {
      if (statusCompletesImmediately) {
        setTimeout(executor,0,resolveFun, rejectFun);
      }else {
        return executor(resolveFun, rejectFun);
      }
    }
  });

  caPromise.clearAdditions = clearAdditions;
  caPromise.resolve = resolveFun;
  caPromise.reject = rejectFun;


  return caPromise;
};
