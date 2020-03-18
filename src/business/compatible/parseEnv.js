/**
 * 同步解析当前客户端环境
 * @param clientClassList : Array<ClientClase>    必须；客户端类数组
 * @return Client
 */
export function synParseEnv(clientClassList) {
  let clientInst = null ;

  let clientClassResult = clientClassList.find(function (ClientClass) {
    let inst = ClientClass.test() ;
    if (inst) {
      clientInst = inst ;
    }
    return !!inst;
  });

  return clientInst ;
}


/**
 * 异步解析当前客户端环境
 * @param clientClassList : Array<ClientClase>    必须；客户端类数组
 * @return Promise<Client>   返回一个promise，该 promise 的 解决的参数是 Client 实例
 */
export function asynParseEnv(clientClassList) {

  let testProList = clientClassList.map(function (ClientClass) {
    return ClientClass.test(true);
  });

  return Promise.race(testProList)
}


/**
 * 解析当前客户端环境，它会先进行同步解析，如果同步解析不成功，则会进行异步解析
 * @param clientClassList : Array<ClientClase>    必须；客户端类数组
 * @param timeout : number    必须；解析超时时间；
 * @param succHandle : (client : Client, asyn : boolean)=>Void    必须；成功解析时的回调函数；
 * @param defaultClientClass : ClientClass    可选；解析超时时的默认客户端类型；
 */
export function parseEnv(clientClassList,timeout,succHandle,defaultClientClass) {

  let synClientInst = synParseEnv(clientClassList);

  if (synClientInst) {
    succHandle(synClientInst,false);
  }else {

    let parsePro = asynParseEnv(clientClassList) ;

    if (typeof timeout == "number") {
      let timeoutPro = new Promise(function (resolve, reject) {
        setTimeout(function () {

          if (defaultClientClass) {
            resolve(defaultClientClass.onlyInstance);
          }else {
            reject();
          }

        }, timeout);
      });

      parsePro = Promise.race([parsePro,timeoutPro]);
    }

    parsePro.then(function (clientInst) {
      succHandle(clientInst,true);
    });
  }

}
