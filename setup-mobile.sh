#!/bin/bash

cd mobile-app

# 初始化Taro项目
yarn add @tarojs/cli@4.0.9 --exact
npx @tarojs/cli init . \
  --typescript \
  --template=default \
  --framework=react \
  --css=sass \
  --projectName=photostudio-mobile

# 添加必要依赖
yarn add @reduxjs/toolkit@1.9.7 react-redux@8.1.3 @tarojs/plugin-framework-react@4.0.9 --exact

# 创建必要的目录结构
mkdir -p src/{assets,components,pages,services}
