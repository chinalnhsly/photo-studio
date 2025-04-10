#!/bin/bash

echo "===== 开始修复SCSS文件中的-webkit-line-clamp问题 ====="

cd /home/liyong/photostudio/mobile-app

# 查找所有包含-webkit-line-clamp的SCSS文件
scss_files=$(grep -l "-webkit-line-clamp" src/pages/cart/index.scss src/pages/marketing/index.scss src/pages/product/list/index.scss)

for file in $scss_files; do
  echo "正在修复文件: $file"
  
  # 1. 确保属性与值之间有空格
  sed -i 's/-webkit-line-clamp:\([0-9]\+\);/-webkit-line-clamp: \1;/g' "$file"
  
  # 2. 添加备注说明这是必要的非标准属性
  sed -i 's/-webkit-line-clamp: \([0-9]\+\);//* autoprefixer: ignore next */ -webkit-line-clamp: \1;/g' "$file"
  
  # 3. 移除任何可能存在的line-clamp属性(非标准，无前缀版本)
  sed -i '/line-clamp: [0-9]\+;/d' "$file"
done

echo "===== 创建SCSS Mixin以提升兼容性 ====="

# 创建一个工具Mixin文件
mkdir -p src/styles
cat > src/styles/mixins.scss << 'EOF'
// 多行文本截断mixin
@mixin line-clamp($lines) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* autoprefixer: ignore next */
  -webkit-line-clamp: $lines;
  overflow: hidden;
  text-overflow: ellipsis;
}
EOF

echo "已创建SCSS Mixin文件: src/styles/mixins.scss"

echo "===== 修复完成 ====="
echo "如果还有问题，建议替换直接使用属性为使用Mixin方式:"
echo "@import '@/styles/mixins.scss';"
echo "然后将 display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; 替换为 @include line-clamp(2);"
