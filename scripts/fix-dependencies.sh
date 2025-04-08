#!/bin/bash

cd mobile-app

# 安装缺失的peer dependencies
yarn add @tarojs/service@4.0.9
yarn add solid-js
yarn add less@4
yarn add stylus@0.54.8

# 升级过时的包
yarn add @swc-node/register --dev
yarn add @babel/plugin-transform-class-properties --dev
yarn add rimraf@4
yarn add glob@9
yarn add @eslint/config-array
yarn add @eslint/object-schema
yarn add isolated-vm

# 移除不安全的包
yarn remove vm2

# 清理缓存并重新安装
yarn cache clean
yarn install

# 验证安装
yarn list --depth=0
