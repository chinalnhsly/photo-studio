#!/bin/bash
cd mobile-app

# 移除不必要的依赖
yarn remove @types/redux

# 安装Taro的Redux相关包
yarn add @tarojs/redux@4.0.9
yarn add @tarojs/plugin-redux@4.0.9
yarn add redux@4.2.1 --exact
yarn add redux-thunk@2.4.2 --exact
yarn add react-redux@7.2.9 --exact

# 清理缓存
yarn cache clean
yarn install --force
