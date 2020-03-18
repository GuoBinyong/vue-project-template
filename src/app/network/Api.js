//获取微信的配置
export function getWeiXinCongfig(currentUrl) {

  let getOptions = {
    urlPath: "/portalwxapi/queryreport/getWeiXinCongfig",
    params: null
  };

  return shareInst.http.get(getOptions);
}


//根据当前关注的公众号或者生活号获取医院相关配置
export function hospitalInfo(params) {
  let getOptions = {
    urlPath: "/api/hospitalInfo",
    params: params
  };
  return shareInst.http.get(getOptions);
}


//首页切换医院
export function getallcustomerhospital(params) {

  let postOptions = {
    urlPath: "/api/hospital/getallcustomerhospital",
    params: params
  };

  return shareInst.http.post(postOptions);
}


//登录获取短信验证码
export function getverificationcode(mobile) {
  let params = {
    mobile: mobile
  };

  let postOptions = {
    urlPath: "/api/user/getverificationcode",
    params: params
  };

  return shareInst.http.post(postOptions);
}

//登录注册接口
export function loginorregister(params) {
  let postOptions = {
    urlPath: '/api/user/loginorregister',
    params: params
  };
  return shareInst.http.post(postOptions);
}


//获取首页功能模块
export function getfunctionlist(data) {
  let postOptions = {
    urlPath: '/api/hospital/getfunctionlist',
    params: data
  };
  return shareInst.http.post(postOptions);
}

