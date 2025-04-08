#!/bin/bash
cd mobile-app

# 移除现有的redux相关包
yarn remove react-redux @reduxjs/toolkit

# 安装Taro的Redux相关包
yarn add @tarojs/with-weapp
yarn add @tarojs/redux@4.0.9
yarn add redux@4.2.1 --exact
yarn add react-redux@7.2.6 --exact

# 清理缓存并重新安装
yarn cache clean
yarn install --force
