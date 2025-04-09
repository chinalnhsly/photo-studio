#!/bin/bash

# 创建组件目录结构
mkdir -p src/pages/index/components/ProductList

# 创建索引文件
echo "export { default as ProductList } from './ProductList'" > src/pages/index/components/index.ts

# 创建组件文件
cat > src/pages/index/components/ProductList/index.tsx << 'EOL'
import { View } from '@tarojs/components'
import './index.scss'

const ProductList = () => {
  return (
    <View className='product-list'>
      <View className='grid'>
        {/* TODO: Add product cards */}
      </View>
    </View>
  )
}

export default ProductList
EOL

# 创建样式文件
cat > src/pages/index/components/ProductList/index.scss << 'EOL'
.product-list {
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 10px;
  }
}
EOL

# 执行权限
chmod +x setup-components.sh
