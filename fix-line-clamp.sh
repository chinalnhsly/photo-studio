#!/bin/bash

echo "修复SCSS文件中的line-clamp属性问题..."

# 找到所有SCSS文件并删除非标准line-clamp属性
find /home/liyong/photostudio/mobile-app -name "*.scss" -exec sed -i 's/line-clamp: [0-9]\+;//g' {} \;

echo "修复完成！"
