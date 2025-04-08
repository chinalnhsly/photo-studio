#!/bin/bash
cd mobile-app

# 移除之前的依赖
yarn remove @tarojs/redux @tarojs/redux-h5 redux-thunk redux-logger

# 安装核心依赖
yarn add redux@4.0.0
yarn add react-redux@7.2.0
yarn add @tarojs/plugin-framework-react@4.0.9

# 安装开发依赖
yarn add --dev @types/react-redux@7.1.25
yarn add --dev redux-devtools-extension@2.13.9

# 清理并重新安装
yarn cache clean
yarn install --force

# 验证安装
echo "验证依赖版本："
yarn list redux --depth=0
yarn list react-redux --depth=0
