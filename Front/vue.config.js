module.exports = {
  transpileDependencies: [
        'vuetify'
    ],
    devServer: {
        proxy: {
            "^/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
                logLevel: "debug",
                pathRewrite: { '^/api': '/' },
            }
        }
    }
}
