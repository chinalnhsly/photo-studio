#!/bin/bash
cd mobile-app

# 移除当前的redux相关包
yarn remove redux react-redux redux-thunk redux-devtools-extension @types/react-redux

# 安装匹配当前React 18.x版本的依赖
yarn add react-redux@8.1.3
yarn add @reduxjs/toolkit@1.9.7
yarn add redux@4.2.1
yarn add redux-thunk@2.4.2

# 安装开发依赖
yarn add --dev @types/react-redux@7.1.25
yarn add --dev @redux-devtools/extension@3.2.5

# 清理并重新安装
yarn cache clean
yarn install --force

# 验证版本
echo "验证依赖版本："
yarn list react-redux --depth=0
yarn list redux --depth=0
yarn list @reduxjs/toolkit --depth=0
