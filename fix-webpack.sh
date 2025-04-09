#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

echo "=== 修复 webpack 依赖问题 ==="

# 备份 package.json 文件
cp package.json package.json.backup

# 清理依赖和缓存
echo "正在清理旧的依赖..."
rm -rf node_modules
rm -rf .taro-cache
rm -f yarn.lock
rm -f package-lock.json

# 使用 yarn 安装 webpack 和必要依赖
echo "安装核心依赖..."
yarn add webpack@5.88.2 \
  webpack-cli@5.1.4 \
  webpack-dev-server@4.15.1 \
  --exact

# 重新安装其他依赖
echo "重新安装所有依赖..."
yarn install

# 验证 webpack 是否正确安装
echo "验证 webpack 安装..."
if [ -f "node_modules/webpack/package.json" ]; then
  echo "✅ webpack 已成功安装!"
  WEBPACK_VERSION=$(node -e "console.log(require('./node_modules/webpack/package.json').version)")
  echo "webpack 版本: $WEBPACK_VERSION"
else
  echo "❌ webpack 安装失败!"
  echo "尝试使用全局安装..."
  yarn global add webpack webpack-cli
  echo "请尝试使用: yarn --verbose 查看详细错误信息"
fi

echo ""
echo "=== 依赖修复完成 ==="
echo "现在可以尝试重新运行: yarn dev:weapp"
