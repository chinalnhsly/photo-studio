#!/bin/bash

# 确保在正确目录
cd /home/liyong/photostudio

# 1. 清理依赖（如果需要）
echo "清理依赖..."
./clean-deps.sh

# 2. 安装依赖
echo "安装依赖..."
yarn install

# 3. 启动小程序开发环境
echo "启动小程序开发环境..."
cd mobile-app
yarn dev:weapp
