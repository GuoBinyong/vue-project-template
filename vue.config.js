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
                ':busine': resolve('src/busine'),
                ':app': resolve('src/app'),
                ':views': resolve('src/app/views'),
                ':network': resolve('src/app/network'),
                ':components': resolve('src/app/components'),
                ':assets': resolve('src/app/assets')
            }
        }
    },
    transpileDependencies:["com-tools","by-http","done-count","by-browser"],
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'stylus',
        patterns: [resolve ("./src/*/(env|profile).styl")]
      }
    }
}
