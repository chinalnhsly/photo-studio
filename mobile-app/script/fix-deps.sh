#!/bin/bash

# 移除旧的依赖
yarn remove webpack webpack-cli webpack-dev-server less stylus solid-js

# 安装正确版本的核心依赖
yarn add react@^18.2.0 react-dom@^18.2.0 --exact

# 安装正确版本的 webpack 相关依赖
yarn add webpack@5.88.2 --exact
yarn add -D webpack-cli@5.1.4 webpack-dev-server@4.15.1 --exact

# 安装样式处理器
yarn add -D less@^4.0.0 stylus@^0.62.0 --exact

# 安装其他必要的开发依赖
yarn add -D solid-js@^1.8.15 --exact

# 清理缓存
rm -rf node_modules/.cache
rm -rf .taro-cache
rm -f yarn.lock

# 重新安装所有依赖
yarn install

# 重新构建
yarn dev:weapp
