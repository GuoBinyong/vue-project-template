import {pagesChildRoutes, pagesStoreConfigs} from './pages/config'



// 路由：开始

export let appChildRoutes = [
  ...pagesChildRoutes,
];

// 路由：结束


// store：开始


// 路由数据存储配置：开始
let routeDataStoreConfig = {
  state: {
    data: {},
    lastDataKey: null
  },
  mutations: {
    setRouteData: function (state, keyAndData) {
      let {key, data} = keyAndData;
      state.data[key] = data;
      state.lastDataKey = key;
    }
  }

};


// 路由数据存储配置：结束


// store：开始

export let appStoreConfigs = [
  {
    modules: {
      route: routeDataStoreConfig
    }
  },

  ...pagesStoreConfigs,
]

// store：结束
