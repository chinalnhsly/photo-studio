#!/bin/bash
cd mobile-app

# 移除不匹配的redux-thunk
yarn remove @types/redux-thunk redux-thunk

# 使用@reduxjs/toolkit内置的thunk中间件
yarn add @reduxjs/toolkit@1.9.7 --exact

# 重新安装核心依赖
yarn add redux@4.2.1 --exact
yarn add react-redux@8.1.3 --exact

# 清理并重新安装
yarn cache clean
yarn install --force
