import Vuex from 'vuex'


/**
 * 定义计算属性 keyName ，表示 state 在 localStorage 中的键名 ，当访问 keyName 时，如果 keyName 不存在，则会取默认值 'StoreState'
 */
Object.defineProperty(Vuex.Store.prototype, 'keyName', {
  get: function () {
    if (!this._keyName) {
      this._keyName = 'StoreState';
    }

    return this._keyName;
  },
  set: function (newValue) {
    if (newValue) {
      this._keyName = newValue;
    }
  }
})


/**
 * 将 state 存储在 localStorage 中；
 * @param keyName ? : string  存储在 localStorage 中的键名，如果未设置该参数，则自动次用 store.keyName 的值作为键名
 */
Vuex.Store.prototype.saveState = function (keyName) {
  this.keyName = keyName;
  localStorage.setAnyItem(this.keyName, this.state);
}


/**
 * 获取存储在 localStorage 中的 state 对象
 * @returns state
 */
Vuex.Store.prototype.getLocalState = function () {
  return localStorage.getParsedItem(this.keyName);
}


/**
 * 把 store 配置数组中所有的配置对象合并成一个store配置对象
 * @param storeConfigs : Array<StoreOptions>  store 的配置数组
 * @returns StoreOptions    store选项对象
 *
 */
function mergeStoreConfigs(storeConfigs) {
  if (!(storeConfigs instanceof Array)) {
    throw new Error(`storeConfigs必须是数组类型，但您传的是：${storeConfigs}`);
  }

  let storeOptions = storeConfigs.reduce(function (merged, config) {

    Object.keys(config).forEach(function (key) {
      let configPropValue = config[key];
      let mergedPropValue = merged[key];
      let newPropValue = null;

      // 注意：有些case有 break，有些没有；这样写可能不太好理解，但比用 if else 节省了好几行代码，从而提高了性能
      switch (key) {
        case "plugins": {
          newPropValue = [...mergedPropValue, ...configPropValue];
          break;
        }
        case "initState":
        case "strict": {
          newPropValue = mergedPropValue || configPropValue;
          break;
        }
        case "modules": {

          if (mergedPropValue) {

            Object.keys(configPropValue).forEach(function (configModulesKey) {

              let mergedModule = mergedPropValue[configModulesKey];

              if (mergedModule) {
                let configModule = configPropValue[configModulesKey];

                //递归调用自己来合并modules中的同名 StoreOptions
                let moduleStoreOptions = mergeStoreConfigs([mergedModule, configModule]);
                configPropValue[configModulesKey] = moduleStoreOptions;

                try {
                  delete mergedPropValue[configModulesKey];
                } catch (e) {

                }

              }

            });

          }
          
          newPropValue = { ...mergedPropValue, ...configPropValue };
          break;
        }
        case "state": {
          if (typeof configPropValue == "function") {
            configPropValue = configPropValue();
          }

          newPropValue = { ...mergedPropValue, ...configPropValue };
          break;
        }
        default: {
          newPropValue = { ...mergedPropValue, ...configPropValue };
        }

      }

      merged[key] = newPropValue;

    });


    return merged;

  }, {});


  return storeOptions;

}


/**
 * 用初始 state 配置 store的选项对象
 * @param storeOptions : StoreOptions   store的选项对象
 * @param initState : State    初始state
 * @param edulcoration : boolean   可选；是否除杂，即：是否需要忽略 storeOptions 的 state 中没有的属性 ；
 * @returns StoreConfig    返回带有初始 state 的配置对象
 *
 *
 * 说明：
 * 由于模块 modules 中的 state 会覆盖全局的 state ，所以，通过把初始 state 传给全局的 state 的方式不能达到给模块设置初始值的目的；
 * 此方法就是为解决这个问题而来的；
 *
 * 注意：
 * 如果某些模块 module 不想用入参 initState 中的 state 作为初始值，只用 module 本身设置的 state 作为初始值，则可以在该模块的 storeOptions 对象中增加一个布尔类型的选项 initState ，其值为 true ，即可；
 * initState 选项表示：是否用该 storeOptions 中配置的 state 作为初始的 state
 *
 * 示例：
 * {
 *   modules:{},
 *   state:{},
 *   mutations:{},
 *   actions:{},
 *   getters:{},
 *   plugins:[],
 *   strict:false,
 *   initState:true
 * }
 *
 */


function configStoreOptionsWhitInitState(storeOptions, initState, edulcoration) {

  if (initState) {

    let modules = storeOptions.modules;

    if (modules) {

      Object.keys(modules).forEach(function (key) {

        let subStoreOptions = modules[key];
        let subInitState = initState[key];

        subStoreOptions = configStoreOptionsWhitInitState(subStoreOptions, subInitState,edulcoration);


        modules[key] = subStoreOptions;

        try {
          delete initState[key];
        } catch (e) {

        }

      });

      storeOptions.modules = modules;

    }



    let configState = storeOptions.state;

    if (edulcoration){

      if (configState && !storeOptions.initState)  {
        let configStateKeys = Object.keys(configState) ;
        storeOptions.state = Object.assignKeys(configState,configStateKeys,initState) ;
      }

    }else {

      if (storeOptions.initState) {
        storeOptions.state = {...initState, ...configState};
      } else {
        storeOptions.state = {...configState, ...initState};
      }

    }


  }


  return storeOptions;
}




/**
 * 把 store 配置数组中所有的配置对象合并成一个带有初始 statestore配置对象
 * @param storeConfigs : Array<StoreOptions>  store 的配置数组
 * @param initState : State    初始state
 * @returns StoreOptions    返回带有初始 state 的选项对象
 */
function mergeStoreConfigsWhitInitState (storeConfigs, initState) {
  if (!(storeConfigs instanceof Array)) {
    throw new Error(`storeConfigs必须是数组类型，但您传的是：${storeConfigs}`);
  }

  let initStoreConfigs = storeConfigs.map((storeConf)=>{
    return configStoreOptionsWhitInitState(storeConf, initState, true);
  });

  let storeOptions = mergeStoreConfigs(initStoreConfigs);

  return storeOptions;
}





// 给 Vuex.Store 添加 mergeStoreConfigs 方法
Vuex.Store.mergeStoreConfigs = mergeStoreConfigs;

// 给 Vuex.Store 添加 configStoreOptionsWhitInitState 方法
Vuex.Store.configStoreOptionsWhitInitState = configStoreOptionsWhitInitState;

// 给 Vuex.Store 添加 mergeStoreConfigsWhitInitState 方法
Vuex.Store.mergeStoreConfigsWhitInitState = mergeStoreConfigsWhitInitState ;



