#!/bin/bash

cd server

# 安装NestJS核心依赖
yarn add @nestjs/core@9.0.0
yarn add @nestjs/common@9.0.0
yarn add @nestjs/platform-express@9.0.0
yarn add reflect-metadata@0.1.13
yarn add rxjs@7.5.5

# 安装Swagger相关依赖
yarn add @nestjs/swagger@6.0.0
yarn add swagger-ui-express@4.5.0

# 安装其他必要依赖
yarn add class-validator@0.13.2
yarn add class-transformer@0.5.1

# 安装开发依赖
yarn add -D @types/node@18.0.0
yarn add -D typescript@4.7.4
yarn add -D ts-node@10.8.1
