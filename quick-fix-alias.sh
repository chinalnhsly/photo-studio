#!/bin/bash

echo "=== 快速修复路径别名问题 ==="

cd /home/liyong/photostudio/mobile-app

# 1. 创建组件目录和基础组件
mkdir -p src/components/ProductCard

# 2. 创建ProductCard组件
cat > src/components/ProductCard/index.jsx << 'EOF'
import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

const ProductCard = ({ product, onClick }) => {
  if (!product) return null;
  
  return (
    <View className='product-card' onClick={onClick}>
      <Image 
        className='product-image' 
        src={product.image || 'https://via.placeholder.com/300'} 
        mode='aspectFill' 
      />
      <View className='product-info'>
        <Text className='product-name'>{product.name}</Text>
        <View className='product-price-row'>
          <Text className='product-price'>¥{product.price}</Text>
          {product.originalPrice > product.price && (
            <Text className='product-original-price'>¥{product.originalPrice}</Text>
          )}
        </View>
        <View className='product-bottom-row'>
          <Text className='product-sales'>已售 {product.sales || 0}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
EOF

cat > src/components/ProductCard/index.scss << 'EOF'
.product-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  width: 100%;
  
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .product-info {
    padding: 16px;
    
    .product-name {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      /* autoprefixer: ignore next */
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    
    .product-price-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .product-price {
        color: #ff6b81;
        font-size: 32px;
        font-weight: bold;
      }
      
      .product-original-price {
        color: #999999;
        font-size: 24px;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }
    
    .product-bottom-row {
      display: flex;
      justify-content: space-between;
      
      .product-sales {
        font-size: 24px;
        color: #999999;
      }
    }
  }
}
EOF

# 3. 创建组件索引文件
cat > src/components/index.js << 'EOF'
import ProductCard from './ProductCard';

export {
  ProductCard
};
EOF

# 4. 修改product/list/index.jsx或index.tsx文件
# 先尝试找到文件
LIST_FILE=""
if [ -f "src/pages/product/list/index.jsx" ]; then
  LIST_FILE="src/pages/product/list/index.jsx"
elif [ -f "src/pages/product/list/index.tsx" ]; then
  LIST_FILE="src/pages/product/list/index.tsx"
fi

if [ -n "$LIST_FILE" ]; then
  # 备份当前文件
  cp "$LIST_FILE" "${LIST_FILE}.bak"
  
  # 替换导入语句
  sed -i 's/import.*@\/components.*/import { ProductCard } from "..\/..\/..\/components";/' "$LIST_FILE"
  
  echo "已修改文件: $LIST_FILE"
else
  echo "无法找到product list页面文件，请手动修改导入语句。"
fi

# 5. 清理缓存
echo "清理缓存..."
rm -rf .temp
rm -rf .cache
rm -rf dist

echo "=== 修复完成 ==="
echo "请重新运行编译命令: yarn dev:weapp"
