#!/bin/bash

# 这个脚本修复node_modules中的类型冲突问题

cd /home/liyong/photostudio/mobile-app

echo "=== 删除重复的React类型定义 ==="

# 查找并列出所有React类型定义位置
find node_modules -name "react" -type d | grep "@types"

# 移除Taro包以外的React类型定义
rm -rf node_modules/@types/react
rm -rf node_modules/@types/react-dom

# 使用yarn安装特定版本的React类型
yarn add @types/react@17.0.2 @types/react-dom@17.0.2 --dev --exact

# 创建符号链接确保所有包使用相同的React类型
mkdir -p node_modules/.types-backup
[ -d "node_modules/@tarojs/taro/node_modules/@types/react" ] && cp -r node_modules/@tarojs/taro/node_modules/@types/react node_modules/.types-backup/

# 遍历所有位置，使用软链接替换为主React类型
find node_modules -path "*/node_modules/@types/react" -type d | while read dir; do
  if [ "$dir" != "node_modules/@types/react" ]; then
    echo "处理: $dir"
    rm -rf "$dir"
    ln -sf "../../../@types/react" "$dir"
  fi
done

echo "=== 修复完成 ==="
echo "重新启动开发服务器: yarn dev:weapp"
