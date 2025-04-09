#!/bin/bash
cd mobile-app

# 移除旧的redux相关包
yarn remove @tarojs/redux react-redux redux redux-thunk

# 安装Taro 4.x推荐的状态管理依赖
yarn add @tarojs/plugin-framework-react@4.0.9 --exact
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact

# 更新package.json中的配置
sed -i 's/"plugins": \[.*\]/"plugins": ["@tarojs\/plugin-framework-react"]/' config/index.js

# 清理并重新安装
yarn cache clean
yarn install --force
