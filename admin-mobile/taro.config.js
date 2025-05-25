module.exports = {
    projectName: 'admin-mobile', // 项目名称
    date: '2025-05-13', // 项目创建日期
    designWidth: 750, // 设计稿宽度
    deviceRatio: {
      '640': 2.34 / 2,
      '750': 1,
      '828': 1.81 / 2
    }, // 设备比
    sourceRoot: 'src', // 源代码目录
    outputRoot: 'dist', // 输出目录
    plugins: [], // 插件配置
    defineConstants: {}, // 定义全局常量
    copy: {
      patterns: [],
      options: {}
    }, // 文件复制配置
    framework: 'react', // 框架选择
    compiler: 'webpack5', // 编译器选择
    cache: {
      enable: false // 是否启用缓存
    }
  };