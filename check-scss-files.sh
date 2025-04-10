#!/bin/bash

echo "=== 检查所有页面是否都有对应的SCSS文件 ==="

cd /home/liyong/photostudio/mobile-app

# 获取所有页面组件文件
page_files=$(find src/pages -name "*.jsx" -o -name "*.tsx")

for page_file in $page_files; do
    # 确定对应的SCSS文件路径
    dir_name=$(dirname "$page_file")
    base_name=$(basename "$page_file" | sed 's/\.[^.]*$//')
    scss_file="$dir_name/$base_name.scss"
    
    # 检查文件是否存在
    if grep -q "import.*\.scss" "$page_file" && [ ! -f "$scss_file" ]; then
        echo "缺少SCSS文件: $scss_file"
        
        # 创建空的SCSS文件
        touch "$scss_file"
        echo "// 自动生成的SCSS文件 - 需要添加样式" > "$scss_file"
        echo "已创建占位文件: $scss_file"
    fi
done

echo "=== 检查完成 ==="
