/**
 * ByURLSearchParams 此类的功能与 URLSearchParams 一样，封装此类的目的是为在不支持 URLSearchParams 的环境中替代 URLSearchParams
 * 注意：此类的包含 URLSearchParams 的所有接口，所以在不支持 URLSearchParams 的环境中，此类可完全替代 URLSearchParams 类；
 */
class ByURLSearchParams {

  queryPrefix=false;  //在获取查询字符串时，是否要带前缀 ?

  constructor(initSearch,paramsPropReplacer){
    this.paramsPropReplacer = paramsPropReplacer;
    this.initSearch = initSearch;
  }





  /**
   * 原始输入的 search
   * @param newValue
   */
  set initSearch(newValue){
    this._initSearch = newValue;
    if (newValue){
      var params = newValue;
      if (typeof newValue != "object"){
        params = parseQueryString(newValue,this.paramsPropReplacer);
      }
      this.params = params;
    }
  }

  get initSearch(){
    return this._initSearch;
  }





  set params(newValue){
    this._params = newValue;
  }

  get params(){
    if (!this._params) {
      this._params = {};
    }
    return this._params;
  }


  get search(){
    return queryStringify(this.params,this.queryPrefix,this.paramsPropReplacer);
  }

  set search(newValue){
    this.initSearch = newValue;
  }




  toString(queryPrefix = this.queryPrefix,paramsPropReplacer = this.paramsPropReplacer){
    return queryStringify(this.params,queryPrefix,paramsPropReplacer);
  }


  append(name, value){
    this.params[name] = value;
  }

  delete(name){
    delete this.params[name];
  }

  entries(){
    return Object.entries(this.params);
  }

  forEach(callback){
    this.entries().forEach(function (kvList) {
      callback(kvList[1],kvList[0]);
    });
  }


  get(name){
    return this.params[name];
  }

  getAll(name){
    let value = this.params[name];
    return [value];
  }

  has(name){
    return this.params.hasOwnProperty(name);
  }

  keys(){
    return Object.keys(this.params);
  }

  set(name, value){
    this.params[name] = value;
  }

  sort(){

  }


  values(){
    return Object.values(this.params);
  }





}




window.ByURLSearchParams = ByURLSearchParams;
