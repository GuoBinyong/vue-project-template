//重定向
export const redirectCA = {

  //条件
  conditions: {

    /**
     * 判断是否带有重定向标识符的 condition
     * @param backLocat : number | any     返回的步数，也可以是传给back函数的其它任何类型的数据
     * @param conditionBack : ConditionBack   调用条件函数的 ConditionBack 对象
     * @returns {redirect: boolean  表示当前页面是否是有重定向标识符}
     *
     *
     * 注意：
     * 此 condition 始终返回对象，即拿 action 始终会被执行，返回的逻辑需要在 action 中根据 条件结果 conditionResult 进行处理
     */
    judgeIsRedirect: function judgeIsRedirect(backLocat, conditionBack) {
      let router = shareInst.router;
      let redirect = router && router.currentRoute.query && router.currentRoute.query.redirect;
      return {redirect: redirect};
    },


    /**
     * 是否带有重定向标识符
     * @param backLocat : number | any     返回的步数，也可以是传给back函数的其它任何类型的数据
     * @param conditionBack : ConditionBack   调用条件函数的 ConditionBack 对象
     * @returns boolean  表示当前页面是否是有重定向标识符
     *
     *
     * 注意：
     * 如果 此 condition 的返回值表示当前页面是否是有重定向标识符，则不会执行 action
     */
    isRedirect: function isRedirect(backLocat, conditionBack) {
      let router = shareInst.router;
      let redirect = router && router.currentRoute.query && router.currentRoute.query.redirect;
      return redirect;
    }
  },





  //行为
  actions: {

    /**
     * 创建 重定向的 action
     * @param actionForRedirect : (backLocat : number | any     返回的步数，也可以是传给back函数的其它任何类型的数据; conditionResult : any  条件结果)=> boolean    是重定义向时执行的 action；默认执行 history.go(-backLocat);
     * @param actionForNormal ? : (backLocat : number | any     返回的步数，也可以是传给back函数的其它任何类型的数据; conditionResult : any  条件结果)=> boolean    不是重定向时执行的 action；默认执行 history.back();
     * @returns actionBeyondHistory : (backLocat : number | any     返回的步数，也可以是传给back函数的其它任何类型的数据; conditionResult : any  条件结果)=> boolean
     */
    createRedirectAction: function createRedirectAction(actionForRedirect, actionForNormal) {

      let redirectAction = function (backLocat, conditionResult, conditionBack) {

        if (conditionResult.redirect) {
          if (actionForRedirect) {
            return actionForRedirect(backLocat, conditionResult, conditionBack);
          } else {
            history.go(-backLocat);
            return true;
          }

        } else if (actionForNormal) {
          return actionForNormal(backLocat, conditionResult, conditionBack);
        } else {
          history.back();
          return true;
        }

      };


      return redirectAction;
    }

  }


};










/**
 * 决定是否需要退出
 * 当 router.isOnSpecialLocats 或者 history.length <= 1 时，退出
 */
export function isNeedQuitC(backLocat, conditionResult, conditionBack){
  return history.length <= 1 || shareInst.router.isOnSpecialLocats ;
}







//行为:开始


/**
 * 用 router 导航 locat
 */
export function goLocatUseRouterA(backLocat, conditionResult, conditionBack) {
  shareInst.router.pushWithData(backLocat);
  return true;
}



/**
 * 在 backWebview 中用 router 导航 locat
 */
export function goLocatUseRouterOnBackWebviewA(backLocat, conditionResult, conditionBack) {

  if (backLocat) {
    let backLocatStr = JSON.stringify(backLocat) ;
    let evalJSStr = `shareInst.router.pushWithData(${backLocatStr})`;
    let backWO = conditionBack.backWebviewObject ;
    backWO.evalJS(evalJSStr);
  }

  let targetWO = conditionBack.targetWebviewObject;
  targetWO.close();

  return true;
}





/**
 * 在 backWebview 中返回
 */
export function backOnBackWebviewA(backLocat, conditionResult, conditionBack) {

  let evalJSStr = `shareInst.router.go(${- backLocat})`;

  let backWO = conditionBack.backWebviewObject ;
  backWO.evalJS(evalJSStr);

  let targetWO = conditionBack.targetWebviewObject;
  targetWO.close();

  return true;
}



//行为:结束
