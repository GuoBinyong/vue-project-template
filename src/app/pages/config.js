// import Entry from './entry/Entry'
import {entryChildRoutes, entryStoreConfigs} from './entry/config'

// import Login from './login/Login'
import {loginStoreConfigs} from './login/config'


import {homeSubChildRoutes, homeSubStoreConfigs} from './home-sub/config'
import {mySubChildRoutes, mySubStoreConfigs} from './my-sub/config'


// 路由：开始

export let pagesChildRoutes = [
/*   {
    path: '/',
    name: 'Entry',
    component: Entry,
    children: entryChildRoutes
  },
  {
    path: '/logIn',
    name: 'LogIn',
    component: Login
  }, */
  ...homeSubChildRoutes,
  ...mySubChildRoutes
];

// 路由：结束


// store：开始



export let pagesStoreConfigs = [
  ...entryStoreConfigs,
  ...loginStoreConfigs,
  ...homeSubStoreConfigs,
  ...mySubStoreConfigs,
]

// store：结束
