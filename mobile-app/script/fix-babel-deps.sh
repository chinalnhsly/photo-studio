#!/bin/bash

# 清理环境
rm -rf node_modules dist
rm -f yarn.lock

# 安装 babel 核心依赖 (使用稳定版本)
yarn add -D \
  @babel/core@7.23.9 \
  @babel/preset-env@7.23.9 \
  @babel/preset-react@7.23.3 \
  @babel/preset-typescript@7.23.3 \
  @babel/runtime@7.23.9 \
  @babel/plugin-transform-runtime@7.23.9 \
  babel-loader@9.1.3 \
  --exact

# 更新 package.json 配置
jq '.babel = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "regenerator": true,
      "helpers": true
    }]
  ]
}' package.json > package.json.tmp && mv package.json.tmp package.json

# 重新构建
yarn build:weapp

echo "Babel 依赖已更新到稳定版本！"
