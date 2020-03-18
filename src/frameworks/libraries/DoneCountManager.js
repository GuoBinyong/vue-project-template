import {createUniqueIdentifier} from ':tools/ByTool'

/**
 * DoneCount
 * 完成计数
 * 用于统计一组操作的完成情况
 */
export class DoneCount{

  /**
   * forcedDone : boolean     强制完成标识
   */
  forcedDone = false;



  //总数量
  get total(){
    if (this.oriTotal == undefined){
      this.oriTotal = 1;
    }
    return this.oriTotal;
  }
  set total(newValue){
    this.oriTotal = newValue;
  }


  //已完成数量
  get doneNum(){
    if (!this._doneNum){
      this._doneNum = 0;
    }

    return this._doneNum;
  }

  set doneNum(newValue){
    this._doneNum = newValue || 0;
  }


  /**
   *
   * @param totalOrOptions : DoneCountOptions
   * DoneCountOptions = total:number | DoneCountProps
   * DoneCountProps = {total:number,doneNum:number}
   */
  constructor(totalOrOptions){
    if (typeof totalOrOptions == "object"){
      var {total,...otherProps} = options;
    }else {
      total = totalOrOptions;
    }


    this.total = total;

    if (otherProps){
      Object.assign(this,otherProps);
    }
  }

  get undoneNum(){
    let total = this.total;
    let doneNum = this.doneNum;
    return total < doneNum ? 0 : total - doneNum;
  }


  /**
   * done : boolean   只读；表示是否完成
   */
  get done(){
    return this.forcedDone || this.realDone
  }

  /**
   * realDone : boolean   只读；表示实际上是否真正的完成
   */
  get realDone(){
    return this.total <= this.doneNum
  }



  /**
   * 重置
   */
  reset(){
    this.total = 1;
    this.resetDoneNum();
  }

  /**
   * 重置
   */
  resetDoneNum(){
    this.doneNum = 0;
  }



  /**
   * 登录新的完成次数
   * @param num : number
   * @returns {*}
   */
  doneAgain(num = 1){
    this.doneNum += num;
    return this.done
  }

}











export class NamedDoneCount extends DoneCount{

  /**
   *
   * @param totalOrOptions : NamedDoneCountOptions
   * NamedDoneCountOptions = total:number | NamedDoneCountProps
   * NamedDoneCountProps = {...DoneCountProps,namesOrNum : Names | DoneNum,names: Names,autoIncrTotalIfRepeat:boolean,maxRepetNum:number}
   *
   * Names : string | [string]
   * DoneNum : number
   */
  constructor(totalOrOptions){

    if (typeof totalOrOptions == "object"){
      var {total,namesOrNum,names,doneNum,...otherProps} = options;
    }else {
      total = totalOrOptions;
    }

    super(total);
    this.total = total;

    if (names) {
      this.doneAgainNames(names);
    }else if (doneNum != undefined){
      this._doneNum = doneNum;
    } else {
      this.doneNum = namesOrNum
    }

    if (otherProps){
      Object.assign(this,otherProps);
    }

  }


  /**
   * 当 name 重复时，是否自动增长 total
   * @type {boolean}
   */
  autoIncrTotalIfRepeat;


  get total(){
    return this.autoIncrTotalIfRepeat ? this.oriTotal * (this.maxNameNum || 1) : this.oriTotal;
  }

  set total(newValue){
    this.oriTotal = newValue;
  }

  get oriTotal(){
    if (this._oriTotal == undefined){
      this._oriTotal = 1;
    }
    return this._oriTotal;
  }
  set oriTotal(newValue){
    this._oriTotal = newValue;
  }




  get nameRecord(){
    if (!this._nameRecord) {
      this._nameRecord = new Map();
    }

    return this._nameRecord;
  }

  /**
   * 最大重复数目
   * @type {number}
   */
  get maxRepetNum(){
    let _maxRepetNum = this._maxRepetNum;
    return (_maxRepetNum && _maxRepetNum > 0) ? _maxRepetNum : Infinity ;
  }

  set maxRepetNum(newValue){
    this._maxRepetNum = newValue;
  }


  /**
   * 获取所有 name 的总计数
   * @returns {number}
   */
  get nameNum(){
    let _nameNum = 0;
    let maxRepetNum = this.maxRepetNum;
    this.nameRecord.forEach((count,key)=>{
      _nameNum += Math.min(count,maxRepetNum);
    });

    return _nameNum;
  }


  get _doneNum(){
    if (this._doneNum_ == undefined){
      this._doneNum_ = 0;
    }

    return this._doneNum_;
  }

  set _doneNum(newValue){
    this._doneNum_ = newValue;
  }


  get doneNum(){
    return this.nameNum + this._doneNum;
  }

  set doneNum(newValue){

    if (typeof newValue == "number"){
      var oldNum = this.doneNum;

      if (oldNum < newValue) {
        this._doneNum = newValue - this.nameNum;
      }else {
        this.resetDoneNum();
        this._doneNum = newValue;
      }

    }else if (newValue == undefined) {
      this.resetDoneNum();
    } else {
      this.doneAgainNames(newValue);
    }

  }





  /**
   * 重置
   */
  resetDoneNum(){
    this.nameRecord.clear();
    this._doneNum = 0;
  }



  /**
   *
   * @param namesOrNum : DoneNamesOrNum
   * DoneNamesOrNum = number | DoneNames
   * DoneNames = string | [string]
   * @returns {*}
   */
  doneAgain(namesOrNum = 1){

    if (typeof namesOrNum == "number") {
      this._doneNum += namesOrNum;
    }else {
      this.doneAgainNames(namesOrNum)
    }
    return this.done
  }


  /**
   * @param names : DoneNames
   * @returns {*}
   */
  doneAgainNames(names){

    if(!Array.isArray(names)){
      names = [names];
    }
    let nameRecord = this.nameRecord;
    names.forEach((nm)=>{
      let nameCount = nameRecord.get(nm) || 0;
      nameRecord.set(nm, ++nameCount);
    });

    return this.done;
  }


  has(name){
    return this.nameRecord.has(name);
  }


  /**
   * 获取指定 name 的计数
   * @param name
   * @returns {*|number}
   */
  getNameNum(name){
    let nameNum = this.nameRecord.get(name) || 0;
    return Math.min(nameNum,this.maxRepetNum);
  }


  /**
   * 获取最大的 name 计数
   * @returns {number}
   */
  get maxNameNum(){
    let countArr = Array.from(this.nameRecord.values());
    let maxCount = countArr.length > 0 ? Math.max.apply(Math,countArr) : 0;

    return Math.min(maxCount,this.maxRepetNum);
  }



}





/**
 * 冲突策略 ConflictPolicy 类型常量
 * ConflictPolicy = "Add" | "Reset" | "Recreate" | "Update"
 */
export const conflictPolicy_Add = "Add";
export const conflictPolicy_Reset = "Reset";
export const conflictPolicy_Recreate = "Recreate";
export const conflictPolicy_Update = "Update"





/**
 * 自动删除目标 AutoDeleteTarget 类型常量
 * AutoDeleteTarget = "ForcedDone" | "RealDone" | "Done"
 */
export const autoDeleteTarget_ForcedDone = "ForcedDone";
export const autoDeleteTarget_RealDone = "RealDone";
export const autoDeleteTarget_Done = "Done";



/**
 * 自动删除目标 AutoDeleteMode 类型常量
 * AutoDeleteMode = "Delay" | "Immediately" | "No"
 */
export const autoDeleteMode_Delay = "Delay";
export const autoDeleteMode_Immediately = "Immediately";
export const autoDeleteMode_No = "No";






export class DoneCountManager {

  /**
   * props : DCManagerProps
   * DCManagerProps = {clearDelay:number,conflictPolicy : ConflictPolicy ,autoDeleteTarget:AutoDeleteTarget ,autoDeleteMode:AutoDeleteMode}
   * @param props
   */
  constructor(props={}) {
    Object.assign(this,props)
  }




  get doneMap(){
    if (!this._doneMap){
      this._doneMap = new Map();
    }

    return this._doneMap;
  }


  set doneMap(newValue){
    this._doneMap = newValue;
  }


  /**
   * 创建 DoneCount 实例
   * @param totalOrOptions : DoneCountOptions
   * @returns {DoneCount}
   */
  _createDoneCount(totalOrOptions){
    return new DoneCount(totalOrOptions);
  }

  /**
   * 在不改变完成数的情况下，根据 confOpts 配置 doneCount
   * @param doneCount : DoneCount
   * @param dcProps : DoneCountProps
   * @returns {*}
   * @private
   */
  _confDoneCount(doneCount,dcProps){
    let {doneNum,...otherProps} = dcProps;
    Object.assign(doneCount,otherProps);
    return doneCount;
  }


  /**
   * 设置 延迟清除已完成的 DoneCount 的延时时间
   * @returns {number|*}
   */
  get clearDelay(){
    if (this._clearDelay == undefined){
      this._clearDelay = 100;
    }

    return this._clearDelay;
  }

  set clearDelay(newValue){
    this._clearDelay = newValue;
  }


  /**
   * 延迟删除指定 key 的 DoneCount
   * @param key : DoneCountKey  需要被延迟删除的 DoneCount 的 key
   * @param delay ?: number   可选；默认值：this.clearDelay； 延时时间；
   *
   * 注意：
   * - 只有 当 doneCount 已经完成时 才会被删除，否则，不会被删除；
   */
  delayClearKey(key,delay = this.clearDelay) {
    let doneCount = this.doneMap.get(key);
    if (doneCount.done) {
      setTimeout(() => {
        this.clearKey(key);
      }, delay);
    }
  }


  /**
   * 删除指定 key 的 DoneCount
   * @param key : DoneCountKey  需要被删除的 DoneCount 的 key
   * @return boolean  表示是否完成删除；
   *
   * 注意：
   * - 只有 当 doneCount 已经完成时 才会被删除，否则，不会被删除；
   * - 当指定 key 的 doneCount 不存时，也会 返回 true ；
   */
  clearKey(key) {

    let doneMap = this.doneMap;

    let doneCount = doneMap.get(key);
    let done = doneCount ? doneCount.done : true;
    if (doneCount && done) {
      doneMap.delete(key);
    }
    return done;

  }

  clear(){
    let keyArr = Array.from(this.doneMap.keys());
    return keyArr.every( (key)=> {
      return this.clearKey(key)
    });
  }


  forcedDoneKey(key){
    let doneCount = this.doneMap.get(key);
    if (doneCount){
      doneCount.forcedDone = true;
    }
  }

  forcedDone(){
    this.doneMap.forEach((dc)=>{
      dc.forcedDone = true;
    });
  }


  /**
   * 注册 DoneCount 时，当 注册的 DoneCount 的 total 和 已存在的 DoneCount 的 total 不一致时 的处理方式
   * @returns {string|*}
   */
  get conflictPolicy(){
    if (!this._conflictPolicy){
      this._conflictPolicy = conflictPolicy_Recreate;
    }

    return this._conflictPolicy;
  }


  set conflictPolicy(newValue){
    this._conflictPolicy = newValue;
  }



  /**
   * 注册DoneCount
   * @param keyOrOpts : DoneAgainOptions
   *
   * DoneAgainOptions = key | {key,conflictPolicy,...DoneCountProps}
   * @returns {DoneCount}
   */
  register(keyOrOpts){
    if (typeof keyOrOpts == "object") {
      var {key,total = 1,conflictPolicy,...otherOpts} = keyOrOpts;
    }else {
      key = keyOrOpts;
      total = 1;
    }

    conflictPolicy = conflictPolicy || this.conflictPolicy;

    let doneMap = this.doneMap;
    let doneCount = doneMap.get(key);
    if  (!doneCount || doneCount.realDone ){
      doneCount =  this._createDoneCount(total);
    }else if (doneCount.oriTotal != total){

      switch (conflictPolicy) {
        case conflictPolicy_Recreate:{
          doneCount  = this._createDoneCount(total);
          break;
        }
        case conflictPolicy_Add:{
          doneCount.total += total;
          break;
        }
        case conflictPolicy_Reset:{
          doneCount.reset();
          doneCount.total = total;
          break;
        }
        case conflictPolicy_Update:{
          doneCount.total = total;
          break;
        }

      }

    }

    if (otherOpts){
      doneCount = this._confDoneCount(doneCount,otherOpts);
    }

    doneMap.set(key,doneCount);

    return doneCount;
  }


  /**
   *
   * @param keyOrOpts : DoneAgainOptions
   * @param doneNum
   * @returns DoneCount | Error
   */
  unsafeDoneAgain(keyOrOpts,doneNum = 1){
    if (typeof keyOrOpts == "object") {
      var {key,doneNum = 1,...otherProps} = keyOrOpts;
    }else {
      key = keyOrOpts;
    }

    let doneCount = this.doneMap.get(key);

    if (!doneCount){
      // console.error("不存在 key 为 %s 的 DoneCount 实例；该 key 对应的 DoneCount 可能已经完成，请检查 相关配置选项是否正确； 传入的参数为: %o",key,arguments);
      let message = `不存在 key 为 ${key} 的 DoneCount 实例；该 key 对应的 DoneCount 可能已经完成，请检查 相关配置选项是否正确； 传入的参数为: ${JSON.stringify(arguments)}`;
      let err = new Error(message);
      err.name = "DoneCountManager"
      return err;
    }

    doneCount.doneAgain(doneNum);

    this.autoDelete(key,otherProps);
    return doneCount;
  }




  /**
   * autoDeleteTarget : AutoDeleteTarget    自动删除目标
   */
  get autoDeleteTarget(){
    if (!this._autoDeleteTarget) {
      this._autoDeleteTarget = autoDeleteTarget_RealDone;
    }

    return this._autoDeleteTarget;
  }

  set autoDeleteTarget(newValue){
    this._autoDeleteTarget = newValue;
  }





  /**
   * autoDeleteMode : AutoDeleteMode   自动删除模式
   */
  get autoDeleteMode(){
    if (!this._autoDeleteMode) {
      this._autoDeleteMode = autoDeleteMode_Delay;
    }

    return this._autoDeleteMode;
  }

  set autoDeleteMode(newValue){
    this._autoDeleteMode = newValue;
  }


  /**
   * 根据配置 options ，自动删除指定 key 的 DoneCount
   * @param key : DoneCountKey    被自动删除的 DoneCount 的 key
   * @param options ?: AutoDeleteOptions   可选；配置选项
   *
   * AutoDeleteOptions = {autoDeleteMode : AutoDeleteMode,autoDeleteTarget : AutoDeleteTarget,clearDelay : number}
   */
  autoDelete(key,options = {}){
    let {autoDeleteMode = this.autoDeleteMode,autoDeleteTarget = this.autoDeleteTarget,clearDelay} = options;

    let doneCount = this.doneMap.get(key);
    switch (autoDeleteTarget) {
      case autoDeleteTarget_RealDone:{
        if (!doneCount.realDone){
          return;
        }
        break;
      }

      case autoDeleteTarget_ForcedDone:{
        if (!doneCount.forcedDone){
          return;
        }
        break;
      }

    }

    switch (autoDeleteMode) {
      case autoDeleteMode_Delay:{
        this.delayClearKey(key,clearDelay);
        break;
      }

      case autoDeleteMode_Immediately:{
        this.clearKey(key);
        break;
      }

    }

  }


  /**
   *
   * @param keyOrOpts : DoneAgainOptions
   * @param doneNum : DoneNamesOrNum
   * @returns {*}
   */
  doneAgain(keyOrOpts,doneNum = 1){
    this.register(keyOrOpts);
    return this.unsafeDoneAgain(keyOrOpts,doneNum);
  }


  getDoneCount(key){
    return this.doneMap.get(key);
  }



  getUndoneNum(key){
    var dc = this.getDoneCount(key);
    return dc?dc.undoneNum : 0;
  }

  getDone(key){
    return this.getUndoneNum(key) == 0 ;
  }




  get info(){
    let info = {total:0,doneNum:0,undoneNum:0};
    let keys = [];
    let allDone = true;
    this.doneMap.forEach((dc,key)=>{
      info.total += dc.total;
      info.doneNum += dc.doneNum;
      info.undoneNum += dc.undoneNum;
      keys.push(key);

      if (!dc.done) {
        allDone = false;
      }
    });

    info.keys = keys;
    info.allDone = allDone;

    return info;
  }


  get total(){
    let total = 0;
    this.doneMap.forEach((dc)=>{
      total += dc.total;
    });
    return total;
  }



  get doneNum(){
    let total = 0;
    this.doneMap.forEach((dc)=>{
      total += dc.doneNum;
    });
    return total;
  }



  get undoneNum(){
    let total = 0;
    this.doneMap.forEach((dc)=>{
      total += dc.undoneNum;
    });
    return total;
  }

  get done(){
    let allDone = true;
    this.doneMap.forEach((dc,key)=>{
      if (!dc.done) {
        allDone = false;
      }
    });

    return allDone;
  }


}








export class NamedDoneCountManager extends DoneCountManager{


  /**
   * 创建 DoneCount 实例
   * @param totalOrOptions
   * @returns {DoneCount}
   */
  _createDoneCount(totalOrOptions){
    return new NamedDoneCount(totalOrOptions);
  }



  /**
   * DoneCount 的 autoIncrTotalIfRepeat 的默认值
   * @type {boolean}
   */
  autoIncrTotalIfRepeat;


  /**
   * 在不改变完成数的情况下，根据 confOpts 配置 doneCount
   * @param doneCount
   * @param confOpts
   * @returns {*}
   * @private
   */
  _confDoneCount(doneCount,confOpts){
    let {namesOrNum,names,doneNum,autoIncrTotalIfRepeat = this.autoIncrTotalIfRepeat,...otherOpts} = confOpts;
    otherOpts.autoIncrTotalIfRepeat = autoIncrTotalIfRepeat;

    Object.assign(doneCount,otherOpts);
    return doneCount;
  }


  /**
   *
   * @param keyOrOpts : DoneAgainOptions
   * @param namesOrNum : DoneNamesOrNum
   * @returns DoneCount | Error
   *
   * DoneAgainOptions = {key,namesOrNum,names,doneNum,...}
   */
  unsafeDoneAgain(keyOrOpts,namesOrNum = 1){
    if (typeof keyOrOpts == "object") {
      var {key,namesOrNum,names,doneNum,...otherProps} = keyOrOpts;
      namesOrNum = doneNum || namesOrNum || 1;
    }else {
      key = keyOrOpts;
    }

    let doneCount = this.doneMap.get(key);

    if (!doneCount){
      // console.error("不存在 key 为 %s 的 DoneCount 实例；该 key 对应的 DoneCount 可能已经完成，请检查 相关配置选项是否正确； 传入的参数为: %o",key,arguments);
      let message = `不存在 key 为 ${key} 的 DoneCount 实例；该 key 对应的 DoneCount 可能已经完成，请检查 相关配置选项是否正确； 传入的参数为: ${JSON.stringify(arguments)}`;
      let err = new Error(message);
      err.name = "DoneCountManager"
      return err;
    }

    if (names) {
      doneCount.doneAgainNames(names);
    } else {
      doneCount.doneAgain(namesOrNum)
    }

    this.autoDelete(key,otherProps);
    return doneCount;
  }


}
