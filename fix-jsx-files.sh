#!/bin/bash

cd /home/liyong/photostudio/mobile-app

echo "=== 检查并修复JSX文件中的TypeScript语法 ==="

# 查找所有包含TypeScript类型注解的JSX文件
echo "检查JSX文件中的类型注解..."

# 修复JSX文件中的类型注解
find src -name "*.jsx" -type f -exec sed -i 's/: any//g' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/: React\.ReactNode//g' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/: JSX\.Element//g' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/(): [a-zA-Z.]* => {/() => {/g' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/ as any//g' {} \;
find src -name "*.jsx" -type f -exec sed -i 's/@ts-ignore//g' {} \;

echo "=== 修复完成 ==="
echo "请重新运行 yarn dev:weapp"
