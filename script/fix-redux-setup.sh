#!/bin/bash
cd mobile-app

# 移除所有Redux相关包
yarn remove redux react-redux @reduxjs/toolkit

# 安装指定版本的Redux相关包
yarn add redux@4.2.1
yarn add react-redux@7.2.9
yarn add @reduxjs/toolkit@1.9.7

# 安装Taro的Redux支持
yarn add @tarojs/redux@4.0.9

# 清理缓存并重新安装
yarn cache clean
yarn install --force
