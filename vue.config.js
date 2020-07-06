const path = require('path');
function resolve (dir) {
    return path.join(__dirname,  dir)
}


module.exports = {
    configureWebpack: {
        resolve:{
            extensions: ['.ts','.js', '.vue', '.json'],
            alias: {
                ':src': resolve('src'),
                ':frame': resolve('src/frame'),
                ':common': resolve('src/common'),
                ':app': resolve('src/app'),
                ':views': resolve('src/app/views'),
                ':network': resolve('src/app/network'),
                ':components': resolve('src/app/components'),
                ':assets': resolve('src/app/assets')
            }
        }
    },
    // transpileDependencies:["com-tools","by-http","done-count","by-browser"],
    css: {
        loaderOptions: {
          less: {
            // 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
            lessOptions: {
              modifyVars: {
                // 直接覆盖变量
                // 'text-color': '#111',
                // 'border-color': '#eee',
                // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                // hack: `true; @import "your-less-file-path.less";`,
              },
            },
          },
        },
      }
}
