type BoolCondition = Exclude<any, Function | Promise<any> | Array<any>>;
type PromCondition = Promise<BoolCondition | FunCondition>
type FunCondition = ()=>(BoolCondition | PromCondition)

type Condition = BoolCondition | FunCondition | PromCondition

type Relationship = "and" | "or"

type LogicOperationResult = boolean | Promise<BoolCondition>



interface ConditionSet  extends Array<Condition | ConditionSet>{
  rel?:Relationship;
  not?:boolean;
}




function conditionLogicOperations(condSet:ConditionSet):LogicOperationResult {

  let notOper:(b:boolean)=>boolean = condSet.not ? function(b){return !b} : function(b){return b}

  let proCondArr:PromCondition[] = []
  let condSetArr:ConditionSet = []

  if (condSet.rel === "or"){

    //先对计算 不是 数组 和 不是 Promise 的 条件进行计算
    let orRes = condSet.some(function (cond) {
      if (!cond){
        return false
      }

      //先跳过数组类型
      if (Array.isArray(cond)){
        condSetArr.push(cond)
        return false
      }

      if (typeof cond === "function"){
        cond = cond()
        if (!(cond instanceof Promise)){
          return cond
        }
      }

      //先跳过 Promise 类型
      if (cond instanceof Promise){
        proCondArr.push(cond)
        return false
      }

      return cond

    });

    if (orRes){
      return notOper(true)
    }

  //  专门 计算 数组条件的 运算结果
  if (condSetArr.length > 0){
    let condSetArrRes = condSetArr.some(function (condSet) {
      let cond = conditionLogicOperations(condSet);

      //先跳过 Promise 类型
      if (cond instanceof Promise){
        proCondArr.push(cond)
        return false
      }

      return cond
    });
    if (condSetArrRes) {
      return notOper(true)
    }
  }

    //  专门 计算 Promise 条件的 运算结果
  if (proCondArr.length > 0){
    // @ts-ignore
    return  Promise.allSettled(proCondArr).then(function (proCondArrResArr:{status:"fulfilled"|"rejected",value:any}[]) {
      let proCondResArr:ConditionSet =  proCondArrResArr.map(function (proRes) {
        if (proRes.status === "fulfilled"){
          return proRes.value
        }else {
          return false
        }
      });

      proCondResArr.rel = condSet.rel;
      proCondResArr.not = condSet.not;
      return conditionLogicOperations(proCondResArr);
    });

  }

  return notOper(orRes) ;




  }else {



    //先对计算 不是 数组 和 不是 Promise 的 条件进行计算
    let andRes = condSet.every(function (cond) {
      if (!cond){
        return false
      }

      //先跳过数组类型
      if (Array.isArray(cond)){
        condSetArr.push(cond)
        return true
      }

      if (typeof cond === "function"){
        cond = cond()
        if (!(cond instanceof Promise)){
          return cond
        }
      }

      //先跳过 Promise 类型
      if (cond instanceof Promise){
        proCondArr.push(cond)
        return true
      }

      return cond

    });

    if (!andRes){
      return notOper(false)
    }

    //  专门 计算 数组条件的 运算结果
    if (condSetArr.length > 0){
      let condSetArrRes = condSetArr.every(function (condSet) {
        let cond = conditionLogicOperations(condSet);

        //先跳过 Promise 类型
        if (cond instanceof Promise){
          proCondArr.push(cond)
          return true
        }

        return cond
      });
      if (!condSetArrRes) {
        return notOper(false)
      }
    }

    //  专门 计算 Promise 条件的 运算结果
    if (proCondArr.length > 0){
      // @ts-ignore
      return  Promise.allSettled(proCondArr).then(function (proCondArrResArr:{status:"fulfilled"|"rejected",value:any}[]) {
        let proCondResArr:ConditionSet =  proCondArrResArr.map(function (proRes) {
          if (proRes.status === "fulfilled"){
            return proRes.value
          }else {
            return false
          }
        });

        proCondResArr.rel = condSet.rel;
        proCondResArr.not = condSet.not;
        return conditionLogicOperations(proCondResArr);
      });

    }

    return notOper(andRes);



  }




}







