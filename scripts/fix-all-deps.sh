#!/bin/bash

# 安装Taro相关依赖
cd mobile-app
yarn add @tarojs/cli@4.0.9
yarn add tsconfig-paths-webpack-plugin@4.0.1 --dev

# 安装NestJS相关依赖
cd ../server
yarn add @nestjs/common@9.0.0
yarn add @nestjs/core@9.0.0
yarn add @nestjs/platform-express@9.0.0
yarn add @nestjs/swagger@6.0.0
yarn add reflect-metadata@0.1.13
yarn add rxjs@7.5.5

# 安装开发依赖
yarn add -D @types/node@18.0.0
yarn add -D typescript@4.7.4
yarn add -D ts-node@10.8.1

# 添加package.json
echo '{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@nestjs/common": "9.0.0",
    "@nestjs/core": "9.0.0",
    "@nestjs/platform-express": "9.0.0",
    "@nestjs/swagger": "6.0.0",
    "reflect-metadata": "0.1.13",
    "rxjs": "7.5.5"
  },
  "devDependencies": {
    "@types/node": "18.0.0",
    "typescript": "4.7.4",
    "ts-node": "10.8.1"
  }
}' > package.json

# 清理并重新安装
yarn cache clean
yarn install --force
