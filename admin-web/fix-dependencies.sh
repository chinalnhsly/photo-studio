#!/bin/bash

# 升级 @ant-design/icons 到兼容版本
npm install @ant-design/icons@4.10.0

# 安装 UMI 类型声明
npm install --save-dev @types/umi

# 清理并重新安装依赖
echo "是否清理 node_modules 并重新安装所有依赖? (y/n)"
read answer

if [ "$answer" = "y" ]; then
  echo "清理 node_modules..."
  rm -rf node_modules
  rm -f package-lock.json
  echo "重新安装依赖..."
  npm install
  echo "完成!"
else
  echo "跳过清理操作，只更新上述包"
fi
