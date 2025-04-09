#!/bin/bash

# 创建页面目录
mkdir -p src/pages/{index,category,cart,user}

# 安装 babel 相关依赖
yarn add -D @babel/preset-react@^7.22.0 \
  @babel/preset-typescript@^7.22.0 \
  @babel/plugin-transform-runtime@^7.22.0

# 修改 babel 配置
echo 'module.exports = {
  presets: [
    ["taro", { framework: "react" }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-runtime"
  ]
}' > babel.config.js

# 重新启动
yarn dev:weapp
