#!/bin/bash

echo "=== 自动修复SCSS文件问题 ==="

cd /home/liyong/photostudio/mobile-app

# 1. 创建可能缺少的目录
mkdir -p src/pages/user
mkdir -p src/pages/home
mkdir -p src/pages/product/detail
mkdir -p src/pages/product/list
mkdir -p src/pages/booking
mkdir -p src/pages/category
mkdir -p src/pages/search
mkdir -p src/pages/user/bookings
mkdir -p src/pages/user/favorites
mkdir -p src/pages/payment

# 2. 检查并创建基本样式模板
create_scss_template() {
    local filepath=$1
    local classname=$2
    
    if [ ! -f "$filepath" ]; then
        echo "// 自动创建的样式文件
.$classname {
  width: 100%;
  min-height: 100vh;
  background-color: var(--background-color, #f8f9fa);
  padding: 20px;
  box-sizing: border-box;
}" > "$filepath"
        echo "创建文件: $filepath"
    else
        echo "文件已存在: $filepath"
    fi
}

# 创建常用页面的SCSS文件
create_scss_template "src/pages/home/index.scss" "home-page"
create_scss_template "src/pages/user/index.scss" "user-page"  # 前面已创建了更完整版本
create_scss_template "src/pages/category/index.scss" "category-page" # 前面已创建了更完整版本
create_scss_template "src/pages/product/detail/index.scss" "product-detail-page"
create_scss_template "src/pages/product/list/index.scss" "product-list-page"
create_scss_template "src/pages/search/index.scss" "search-page"
create_scss_template "src/pages/user/bookings/index.scss" "bookings-page"

# 3. 全局扫描找出所有可能存在问题的文件
page_files=$(find src/pages -name "index.jsx" -o -name "index.tsx" -o -name "index.js")

for page_file in $page_files; do
    # 获取对应的SCSS文件路径
    dir_name=$(dirname "$page_file")
    scss_file="$dir_name/index.scss"
    
    # 检查JS/JSX/TSX文件中是否导入了SCSS
    if grep -q "import.*\.scss" "$page_file"; then
        classname=$(basename "$dir_name")"-page"
        
        # 如果SCSS文件不存在，创建一个
        if [ ! -f "$scss_file" ]; then
            create_scss_template "$scss_file" "$classname"
        fi
    fi
done

echo "=== 修复完成 ==="
echo "请重试编译: yarn dev:weapp"
