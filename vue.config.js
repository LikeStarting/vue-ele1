const path = require('path')
module.exports = {
    publicPath: process.env.NODE_ENV == 'production' ? '/public' : '/',
    outputDir: 'dist',
    assetsDir: 'assets',
    indexPath: 'index.html',
    productionSourceMap: false,
    lintOnSave: process.env.NODE_ENV !== 'production',
    runtimeCompiler: true,
    filenameHashing: true,
    //webpack配置
    chainWebpack: config => {

    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.mode = 'production'
        } else {
            config.mode = 'development'
        }

        Object.assign(config, {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    'assets': path.resolve(__dirname, './src/assets'),
                    'components': path.resolve(__dirname, './src/components')
                }
            }
        })
    },
    devServer: {
        host: 'localhost',
        port: 8088,
        https: false,
        open: true,
        // proxy: {

        // }
    },
    css: {
        modules: false,
        extract: true,
        sourceMap: false,
        loaderOptions: {}
    }
}