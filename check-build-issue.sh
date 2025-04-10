#!/bin/bash

echo "===== 检查构建问题 ====="
cd /home/liyong/photostudio/mobile-app

echo "1. 检查Node版本..."
node -v

echo "2. 检查全局Taro CLI版本..."
taro -v || echo "未安装全局Taro CLI"

echo "3. 检查项目内Taro依赖版本..."
grep "@tarojs/cli" package.json
grep "@tarojs/webpack5-runner" package.json

echo "4. 检查Webpack版本..."
npx webpack --version

echo "5. 验证SCSS文件是否存在..."
find src -name "*.scss" | grep category

echo "===== 诊断完成 ====="
echo ""
echo "如果上述信息正常，请尝试使用npm而非yarn："
echo "npm run dev:weapp"
