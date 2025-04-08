#!/bin/bash
cd mobile-app

# 移除旧的依赖
yarn remove @tarojs/redux

# 安装必要的redux依赖
yarn add redux@4.2.1 --exact
yarn add @types/redux --dev

# 清理并重新安装
yarn cache clean
yarn install --force
