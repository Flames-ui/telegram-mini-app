module.exports = {
  webpack: {
    configure: (config) => {
      config.plugins.forEach(plugin => {
        if (plugin.constructor.name === 'HtmlWebpackPlugin') {
          plugin.options.filename = 'admin.html'
        }
      })
      return config
    }
  }
