#!/bin/bash

echo "开始清理项目缓存..."

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 清理缓存
rm -rf .temp
rm -rf .cache
rm -rf dist

# 可选：如果依赖有问题，可以解除下面的注释清理node_modules
# echo "清理node_modules（这可能需要几分钟）..."
# rm -rf node_modules
# yarn install

echo "清理完成，开始重新编译..."

# 重新编译
yarn build --type weapp --watch

echo "如果上述编译仍有问题，请尝试完全重装依赖："
echo "rm -rf node_modules yarn.lock"
echo "yarn install"
