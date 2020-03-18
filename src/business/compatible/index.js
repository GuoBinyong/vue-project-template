import {parseEnv,synParseEnv} from './parseEnv'

import Browser from './Browser'
import Ios from './Ios'
import Android from './Android'
import StreamApp from './StreamApp'
import WeChat from './WeChat'
import Alipay from './Alipay'
import WxMiniProgram from './WxMiniProgram'


let clientClassList = [WeChat,WxMiniProgram,Android,Ios,Alipay];  //需要测试的客户端类型数组
let defaultClientClass = Browser ;  //默认的客户端类型
let clientTestTimeout = 2000;    //客户端检测超时时间



/**
 * 给 window.shareInst 定义计算属性 client ，用于存储当前的客户端对象 ，当访问 client 时，如果 client 不存在，则会默认用 defaultClientClass 创建
 *
 * 注意：
 * 当客户变更时，window 会派发 clientChange 事件，以表示客户端变更 ；事件对象中 有 value 和 oldValue 属性，分别保存更改前 和 更改后 的值
 */
Object.defineProperty(window.shareInst, 'client', {
  get: function () {
    if (!this._client) {
      let _client = synParseEnv(clientClassList);
      if (!_client){
        _client = defaultClientClass.onlyInstance ;
      }
      this._client = _client;
      this.clientReady;
    }
    return this._client;
  },
  set: function (newValue) {
    if (newValue && newValue !== this._client) {
      //派发 clientChange 事件
      let change = new Event("clientChange", {"bubbles": true});
      change.value = newValue;
      change.oldValue = this._client;

      this._client = newValue;

      window.dispatchEvent(change);
    }
  }
});





/**
 * 给 window.shareInst 定义计算属性 clientReady ，用于获取客户端的准备状态的promise ，当访问 clientReady 时，如果 clientReady 不存在，则会自动创建
 */
Object.defineProperty(window.shareInst, 'clientReady', {
  get: function () {
    if (!this._clientReady) {
      this._clientReady = new Promise(function (resolve, reject) {

        parseEnv(clientClassList,clientTestTimeout,function (clientInst,asyn) {
          shareInst.client = clientInst ;

          if (clientInst) {
            resolve(clientInst)
          }else {
            reject();
          }

        },defaultClientClass);

      });
    }
    return this._clientReady;
  }
});


shareInst.clientReady;
