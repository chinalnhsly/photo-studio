#!/bin/bash

# 清理旧的缓存（可选）
rm -rf node_modules/.cache/taro
rm -rf node_modules/.cache/webpack

# 创建缓存目录
mkdir -p node_modules/.cache/taro
mkdir -p node_modules/.cache/webpack

# 更新项目配置
yarn add -D cache-loader terser-webpack-plugin --exact

# 重新构建（开发模式）
NODE_ENV=development yarn dev:weapp

echo "缓存已启用，二次构建速度将显著提升！"
