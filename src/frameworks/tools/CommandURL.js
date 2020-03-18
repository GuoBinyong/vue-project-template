
import qs from 'qs' ;

//命令转换：开始

const defaultNamespaces = "anonymity" ;  //默认的命令空间


/**
 * 把命令对象转换为 命令 URL
 * @param commandObj : {protocol  : string ,namespaces ？ : string, command ? : string,params ? : Object}
 * @return string
 */
function urlStringifyCommandObj (commandObj){

  let commandURL = "" ;

  if (commandObj) {

    let {protocol,namespaces = defaultNamespaces ,command,params} = commandObj ;

    commandURL = `${protocol}://${namespaces}` ;

    if (command) {
      commandURL = `${commandURL}/${command}` ;
    }

    if (params) {
      let paramsStr = qs.stringify(params) ;
      commandURL = `${commandURL}?${paramsStr}` ;
    }

  }


  return commandURL ;
}


/**
 * 把 URL 转换为 命令对象
 * @param commandURL : string     命令 URL 字符串
 * @return {protocol: string, namespaces: string, command: string, params: Object}
 */
function parseCommandURL(commandURL) {

  let cmdObj = {
    protocol: "" ,
    namespaces : "" ,
    command: "" ,
    params: {}
  };

  if  (commandURL && commandURL.isURL){

    let urlInst = new window.URL(commandURL) ;
    let params = qs.parse(urlInst.search,{ ignoreQueryPrefix: true });

    cmdObj.protocol = urlInst.protocol ;
    cmdObj.namespaces = urlInst.host ;
    cmdObj.command = urlInst.pathname ;
    cmdObj.params = params;

  }

  return cmdObj ;

}



export default {
  urlStringify: urlStringifyCommandObj ,
  parse: parseCommandURL
}

