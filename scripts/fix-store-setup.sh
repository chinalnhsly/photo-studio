#!/bin/bash
cd mobile-app

# 安装必要的依赖
yarn add @reduxjs/toolkit@1.9.7 --exact
yarn add react-redux@8.1.3 --exact

# 清理并重新安装
yarn cache clean
yarn install --force
