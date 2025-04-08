#!/bin/bash

# 安装 Redux 相关依赖
yarn add @reduxjs/toolkit@^1.9.7 \
        react-redux@^8.1.3 \
        @types/react-redux@^7.1.25

# 安装 React 相关依赖
yarn add react@^18.2.0 \
        react-dom@^18.2.0 \
        @types/react@^18.2.0 \
        @types/react-dom@^18.2.0

# 清理缓存并重新构建
yarn cache clean
yarn install
