module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        
        // 主题路径
        // "styleLibraryName": "theme-chalk"   //element-ui库中自带的默认主题
        "styleLibraryName": "~src/business/theme"
      }
    ]
  ]
}