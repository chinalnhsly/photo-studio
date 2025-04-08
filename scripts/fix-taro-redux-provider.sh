#!/bin/bash
cd mobile-app

# 移除当前的redux相关包
yarn remove react-redux @reduxjs/toolkit

# 安装Taro专用的Redux包
yarn add @tarojs/plugin-framework-react@4.0.9 --exact
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add redux@4.2.1 --exact

# 清理并重新安装
yarn cache clean
yarn install --force
