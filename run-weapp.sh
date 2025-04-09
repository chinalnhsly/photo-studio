#!/bin/bash

# 确保在正确目录
cd /home/liyong/photostudio/mobile-app

# 清理旧的编译文件
rm -rf dist
rm -rf .taro-cache

# 设置开发环境变量
export NODE_ENV=development

# 编译运行小程序
echo "正在编译小程序，请稍候..."
yarn build:weapp

echo ""
echo "=============================================="
echo "✅ 编译完成！"
echo "请在微信开发者工具中打开以下目录："
echo "/home/liyong/photostudio/mobile-app/dist"
echo "=============================================="
echo ""
echo "开始监听文件变化并实时编译..."
yarn dev:weapp
