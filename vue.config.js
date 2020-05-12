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
                ':assets': resolve('src/app/assets'),

                // fixme:有待更改
                ':components': resolve('src/frame/components'),
                ':compatible': resolve('src/busine/compatible'),
                ':network': resolve('src/app/network'),
                ':libraries': resolve('src/frame/libraries'),
                ':tools': resolve('src/frame/tools')
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
