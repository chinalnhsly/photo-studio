module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {
    // 压缩配置
    webpackChain(chain) {
      chain.optimization.minimize(true)
    }
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析
     * 参考文档：https://taro-docs.jd.com/docs/optimizing-bundle
     */
  }
}
