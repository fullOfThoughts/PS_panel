module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'development', config => {
      config.plugin("html").tap(args => {
        args[0].iProd = false
        return args
      })
      return config
    })
    config.when(process.env.NODE_ENV === 'production', config => {
      config.plugin("html").tap(args => {
        args[0].isProd = true
        return args
      })
      return config
    })
  }
}