import {createUniqueIdentifier} from "../tools/ByTool"

class WindowMessage extends EventTarget{


  /**
   * @property id : string   只读；WindowMessage 实例的唯一标识
   */


  private _id:string;
  get id():string{
    if (!this._id){
      this._id = createUniqueIdentifier();
    }
    return this._id;
  }




  /**
   * namespace ?: string   可选；命名空间
   */
  namespace?:string;

  /**
   * set : (key:string,value:any,namespace:string)=>void    设置 key 和 value 的回调函数;
   */
  set:(key:string,value:any,namespace?:string)=>void;

  /**
   * get : (key:string,namespace:string)=>value:any    获取 key 和 value 的回调函数;
   */
  get:(key:string,namespace?:string)=>any;


  /**
   * 查检时间间隔
   */
  checkInterval:number = 300;


  constructor(id: string) {
    super();
    this._id = id;
  }



  addEventListener(type, listener, options) {
    super.addEventListener(...(arguments as unknown  as [string,EventListenerOrEventListenerObject | null, boolean | AddEventListenerOptions | null]));
  }




}
