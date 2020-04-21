import * as By from "by-browser"

import "vue-exp"
// import Vue from "vue"


// import  "vuex-expand"

// import {ByHttp} from "by-http"
// import VueRouterExtendPlugin from "./libraries/VueRouterExtendPlugin"






declare global {
     var by:typeof By;
}




window.by = By;
