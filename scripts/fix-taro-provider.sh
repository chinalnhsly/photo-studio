#!/bin/bash
cd mobile-app

# 安装Taro的Redux依赖
yarn add @tarojs/redux@4.0.9
yarn add @tarojs/redux-h5@4.0.9

# 清理并重新安装
yarn cache clean
yarn install --force
