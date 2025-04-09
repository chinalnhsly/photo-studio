// 添加babel配置，强制使用JSX转换，放宽类型检查

module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ],
  plugins: [
    // 添加运行时类型转换插件
    ["@babel/plugin-transform-runtime", {
      "corejs": 3
    }]
  ]
}
