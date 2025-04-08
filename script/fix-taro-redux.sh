#!/bin/bash
cd mobile-app

# 首先移除所有相关包
yarn remove @tarojs/redux @tarojs/redux-h5 redux redux-thunk redux-logger

# 安装特定版本的包
yarn add @tarojs/taro@4.0.9
yarn add @tarojs/redux@4.0.9
yarn add @tarojs/plugin-framework-react@4.0.9
yarn add @tarojs/plugin-platform-weapp@4.0.9
yarn add redux@4.0.0
yarn add redux-thunk@2.3.0
yarn add redux-logger@3.0.6
yarn add @types/redux-logger@3.0.13 --dev

# 清理并重新安装
yarn cache clean
yarn install --force

# 验证安装
echo "验证依赖版本："
yarn list @tarojs/taro --depth=0
yarn list @tarojs/redux --depth=0
yarn list redux --depth=0
