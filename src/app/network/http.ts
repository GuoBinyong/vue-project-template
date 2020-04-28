import ByHttp,{HttpConfig} from 'by-http' ;


// 公共配置：开始
const pubConf:HttpConfig = {
  method: "GET",     //默认的请求方式
  mainData:true,
  mainDataGet:function(resData){
    return resData.result
  },
  validateDataStatus:function(responseData, reqOptions){
    return responseData.status == 0
  },
};

// 公共配置：结束




// http：开始
by.defineListenableProperty(window.shareInst,"http",{
  getDefault:function(){
    return new ByHttp({
      baseURL: "/api",
      ...pubConf
    });
  }
});
// http：结束


// http2：开始
by.defineListenableProperty(window.shareInst,"http2",{
  getDefault:function(){
    return new ByHttp({
      baseURL: "/api2",
      ...pubConf
    });
  }
});

// http2：结束


declare global {
  interface ShareInst {
    // 全局声明 http
    http:ByHttp;
    httpReady:Promise<ByHttp>;

    // 全局声明 http2
    http2:ByHttp;
    http2Ready:Promise<ByHttp>;
  }
}