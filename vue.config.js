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
                ':frameworks': resolve('src/frameworks'),
                ':business': resolve('src/business'),
                ':app': resolve('src/app'),
                ':assets': resolve('src/app/assets'),

                // fixme:有待更改
                ':components': resolve('src/frameworks/components'),
                ':compatible': resolve('src/business/compatible'),
                ':network': resolve('src/app/network'),
                ':libraries': resolve('src/frameworks/libraries'),
                ':tools': resolve('src/frameworks/tools')
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
