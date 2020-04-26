import ByHttp,{HttpConfig} from 'by-http' ;


// 域名:开始
let domain = null;

if (process.env.NODE_ENV === 'production') {
  domain = "www.jknys.cn:8060";     //正式
}

// 域名:结束



const baseURL = `http://${domain}/`;    //url的基地址，根url


const httpConfig:HttpConfig = {
  baseURL: baseURL,
  method: "GET",     //默认的请求方式
};




by.defineListenablePropertyGetter(window.shareInst,"http",function () {
  return new ByHttp(httpConfig);
});

declare global {
  interface ShareInst {
    http:ByHttp;
    httpReady:Promise<ByHttp>;
  }
}