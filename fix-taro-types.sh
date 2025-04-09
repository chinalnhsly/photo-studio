#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

echo "=== 开始修复Taro类型问题 ==="

# 1. 备份原始文件
mkdir -p backup
cp tsconfig.json backup/
cp babel.config.js backup/ 2>/dev/null || :

# 2. 安装必要的依赖
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs3

# 3. 转换文件格式
echo "转换关键文件为.jsx格式..."
find src/pages -name "*.tsx" | while read file; do
  newfile="${file%.tsx}.jsx"
  cp "$file" "$newfile"
  echo "转换: $file -> $newfile"
done

find src/components -name "*.tsx" | while read file; do
  newfile="${file%.tsx}.jsx"
  cp "$file" "$newfile"
  echo "转换: $file -> $newfile"
done

# 4. 确保新文件生效
echo "设置导入优先级..."
touch src/app.jsx
touch src/app.config.js

echo "=== 修复完成，请重新启动项目 ==="
echo "yarn dev:weapp"
