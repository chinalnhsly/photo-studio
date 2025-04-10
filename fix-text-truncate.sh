#!/bin/bash

# 创建备份
mkdir -p /home/liyong/photostudio/backups
cp -r /home/liyong/photostudio/mobile-app/src/components/ProductCard \
   /home/liyong/photostudio/backups/ProductCard_$(date +"%Y%m%d_%H%M%S")

# 修复SCSS文件中的语法错误
sed -i 's/-webkit-line-clamp:2/-webkit-line-clamp: 2/g' \
   /home/liyong/photostudio/mobile-app/src/components/ProductCard/index.scss

echo "已修复语法错误。如果问题仍然存在，请考虑使用纯JSX方式实现文本截断。"
