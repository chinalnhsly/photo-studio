#!/bin/bash

# 安装必要的依赖
yarn add -D \
  eslint-webpack-plugin@4.1.0 \
  process@0.11.10 \
  buffer@6.0.3 \
  path-browserify@1.0.1 \
  stream-browserify@3.0.0 \
  enhanced-resolve@5.15.0 \
  --exact

# 更新 package.json 的 resolutions 字段
jq '.resolutions = {
  "enhanced-resolve": "5.15.0",
  "@types/webpack": "5.28.5"
}' package.json > package.json.tmp && mv package.json.tmp package.json

# 清理缓存
rm -rf node_modules/.cache
rm -rf dist

# 重新安装所有依赖
yarn install --force

# 重新构建
yarn build:weapp

echo "解析器配置已更新！请在微信开发者工具中重新构建项目"
