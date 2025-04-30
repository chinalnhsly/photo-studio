#!/bin/bash

echo "===== 清理项目 ====="
rm -rf node_modules
rm -rf admin-web/node_modules
rm -rf admin-web/src/.umi
rm -rf admin-web/src/.umi-production

echo "===== 安装依赖 ====="
yarn install

echo "===== 启动项目 ====="
cd /home/liyong/photostudio/admin-web
NODE_OPTIONS=--openssl-legacy-provider yarn start
