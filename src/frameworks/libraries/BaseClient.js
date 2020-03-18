import semver from 'semver'

/**
 * 客户端的基类
 *
 * 注意：
 * 子类需要定义以下成员：
 * static  osName : string    系统名字
 * static synTest : ()=>boolean      同步测试
 * static asynTest : (resolve, reject)=>Promise   异步测试
 */
export default class BaseClient {

  //不能重载的成员：开始

  //用户保存各个子类的单例
  static _onlyInstanceMap = {} ;

  //获取当前子类的单例
  static get onlyInstance(){
    if (!this._onlyInstanceMap[this.osName]){
      this._onlyInstanceMap[this.osName] = new this();
    }

    return this._onlyInstanceMap[this.osName]
  }




  get osName(){
    return this.constructor.osName;
  }


  /**
   * 测试当前环境是否是当前类所对应的客户端环境
   * @param asyn ? : boolean   可选；默认值：false ； 表示是否要进入异步测试
   * @return Client类型的实例  || Promise  ；
   *
   * 当 asyn  为 true 时， 返回 Promise 实例，Promise 实例解决时的参数为 当前Client类型的实例；
   * 当 asyn 为 fasle 或 被省略时， 返回当前Client类型的实例；
   *
   */
  static test(asyn) {
    if (asyn){

      return new Promise( (resolve, reject)=> {

        if (this.synTest()) {
          resolve(this.onlyInstance);
        } else {
          this.asynTest(()=> {resolve(this.onlyInstance)},()=>{reject()});
        }

      });

    }else {

      if (this.synTest()) {
        return this.onlyInstance;
      }else {
        return null;
      }

    }


  }





  //版本：开始


  /**
   * versionRange : string 客户端依赖的版本范围
   *
   * 每个客户依赖的版本范围是配置在 客户的属性 versionRangeMap 中；
   * versionRangeMap 是个对象；以客户的 osName 为属性名，依赖版本范围字符串为属性值
   */
  get versionRange(){
    let versionRangeMap = this.versionRangeMap;
    return dependVersionMap && dependVersionMap[this.osName]
  }




  /**
   * isSatisfyingVersionRange ： 表示客户端版本是否符合版本范围 versionRange 的限制； 如果 版本version 或 版本范围versionRange 无效，则了会返回 true ，表示符合版本范围的要求
   */

  /**
   * 判断版本version是否符合版本范围 versionRange 的限制； 如果 版本 version 或 版本范围 versionRange 无效，则了会返回 true ，表示符合版本范围的要求
   * @param versionRange : string    版本范围
   * @param version ? : string    可选：默认值：当前客户端的版本号
   * @returns boolean
   *
   * 备注：
   * 版本规范请参考 : https://semver.org
   */
  satisfiesVersionRange(versionRange,version){
    if (!version) {
      version = this.version;
    }

    if (versionRange && version) {
      let isValidRange = semver.validRange(versionRange);
      if (!isValidRange) {
        console.error("版本范围无效：",versionRange);
      }

      let isValidVersion = semver.valid(version);
      if (!isValidVersion) {
        console.error("版本无效：",version);
      }

      if (isValidRange && isValidVersion) {
        return semver.satisfies(version,versionRange);
      }

    }

    return true;
  }


  /**
   * isSatisfyingVersionRange ： 表示客户端版本是否符合版本范围 versionRange 的限制； 如果 版本version 或 版本范围versionRange 无效，则了会返回 true ，表示符合版本范围的要求
   */
  get isSatisfyingVersionRange(){
    return this.satisfiesVersionRange(this.versionRange,this.version);
  }


  //版本：结束






  /**
   * 派发客户事件
   * @param eventName : string    事件的名字
   * @param data : any    事件的附带数据
   *
   *
   * 注意：
   * - 如果 this[eventName + "Handle"] 存在,则会在派发事件之前先调用 this[eventName + "Handle"](data) ；
   * - 事件是在 window 上派发，所以如果需要监听，则需要在 window 上监听；
   * - data 数据 会附带在 事件对象的 data 属性上： event.data
   */
  dispatchClientEvent(eventName,data){

    if (eventName) {

      let eventHandleStr = eventName + "Handle" ;
      let eventHandle = this[eventHandleStr] ;
      if (eventHandle) {
        eventHandle.call(this,data) ;
      }

      let clientEvent = new Event(eventName, {"bubbles": true});
      clientEvent.data = data ;
      window.dispatchEvent(clientEvent);
    }
  }



  //不能重载的成员：结束








  //需要子类重载的成员：开始


  //环境检测：开始


  /**
   * 系统名字
   * @type string
   */
  static  osName = "client" ;


  /**
   * 同步测试
   * @return boolean    表示是否是当前类型的对应的客户环境
   */
  static synTest(){
    return false;
  }

  /**
   * 异步测试
   * @param resolve : function   , 测试成功的回调函数
   * @param reject  : function   , 测试失败的回调函数
   */
  static asynTest(resolve, reject){

  }


  //环境检测：结束





  //构造函数：开始

  /*
  经过研究分析，发现：JS的构造函数 constructor 的执行步骤如下：
  1. 先进行该类的方法的创建；
  2. 然后执行 super()，调用父类的构造函数；
  3. 再执行类的属性的创建和默认值的设置；
  4. 最后执行构造函数 constructor 中 super() 下面的语句；

  所以，当需要把逻辑抽离到父类，在父类中访问子类的属性时，就获取不到子类的属性，因为此时子类的属性还末创建和设置；
  为了解决这个问题，我设计了如下解决方案：

  1. 定义一个用于创建被父类依赖的属性（简称：父类依赖属性）的方法 `initProperty()`；并在该方法中首先向上调用该方法 `super.initProperty()`， 注意：最顶层类的该方法不需要向上调用 ;
  2. 定义一个用于执行依赖子类属性的操作（简称：子类依赖操作）的方法 `initAction()` ; 并在该方法中首先向上调用该方法 `super.initAction()` ，注意：最顶层类的该方法不需要向上调用 ；
  3. 在最顶层的类的构造函数中调用 先调用 创建父类依赖属性的方法 `this.initProperty()` ，然后再调用 执行 子类依赖操作 的方法 `this.initAction()` ；

  注意：
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */
  constructor(){


    //先调用 创建父类依赖属性的方法
    let initProperty = this.initProperty ;
    if (initProperty && (typeof initProperty) == "function") {
      this.initProperty();
    }

    //再调用 执行 子类依赖操作 的方法
    let initAction = this.initAction ;
    if (initAction && (typeof initAction) == "function") {
      this.initAction();
    }

  }


  /*
  该方法用于创建被父类依赖的属性（简称：父类依赖属性） ；

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initProperty()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initProperty(){
    // super.initProperty();

  }



  /*
  该方法用于执行依赖子类属性的操作（简称：子类依赖操作）

  注意：
  - 子类需要在该方法中首先向上调用该方法 `super.initAction()`；
  - 最顶层类的该方法不需要向上调用 ;
  - 由于 `initProperty()`  和  `initAction()`  是在最顶层类的构造函数中调用的，所以子类的构造函数中的 `super()` 语句下的代码会在 这2个方法（`initProperty()` 和 `initAction()`）之后执行；

  */

  initAction(){
    // super.initAction();

  }


  //构造函数：结束



  //版本：开始


  /**
   * 用于配置各咱客户端版本范围的对象；
   * 其中，属性名为客户的 osName ，属性值为该客户的版本范围
   */
  versionRangeMap = {};


  /**
   * version : 返回当前客户端的版本；
   * 计算属性，只读；
   */
  get version(){
    return;
  }

  //版本：结束



  //需要子类重载的成员：结束





}
