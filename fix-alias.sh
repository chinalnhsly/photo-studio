#!/bin/bash

echo "=== 开始修复别名解析问题 ==="

cd /home/liyong/photostudio/mobile-app

# 创建components目录
mkdir -p src/components/ProductCard

# 创建ProductCard组件
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
          {product.discount && (
            <Text className='product-discount'>{product.discount}折</Text>
          )}
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
  background-color: var(--white, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.05));
  margin-bottom: 20px;
  width: 100%;
  
  .product-image {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    object-fit: cover;
  }
  
  .product-info {
    padding: 16px;
    
    .product-name {
      font-size: 28px;
      font-weight: bold;
      color: var(--text-color, #333333);
      margin-bottom: 12px;
      /* 使用兼容性更好的多行文本截断方法 */
      display: -webkit-box;
      /* autoprefixer: ignore next */
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      
      .product-price {
        color: var(--primary-color, #ff6b81);
        font-size: 36px;
        font-weight: bold;
      }
      
      .product-original-price {
        color: var(--light-text, #999999);
        font-size: 24px;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }
    
    .product-bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .product-discount {
        font-size: 22px;
        color: var(--white, #ffffff);
        background-color: var(--primary-color, #ff6b81);
        padding: 2px 8px;
        border-radius: 10px;
      }
      
      .product-sales {
        font-size: 22px;
        color: var(--light-text, #999999);
      }
    }
  }
}
EOF

# 创建组件索引文件
cat > src/components/index.js << 'EOF'
import ProductCard from './ProductCard';

export {
  ProductCard
};
EOF

# 更新配置文件确保别名正常工作
mkdir -p config
cat > config/index.js << 'EOF'
const path = require('path');

const config = {
  projectName: 'photostudio-mobile',
  date: '2023-6-15',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/types': path.resolve(__dirname, '..', 'src/types')
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain, webpack) {
      // 设置别名，解决路径问题
      chain.resolve.alias
        .set('@', path.resolve(__dirname, '..', 'src'))
        .set('@/components', path.resolve(__dirname, '..', 'src/components'))
        .set('@/pages', path.resolve(__dirname, '..', 'src/pages'))
        .set('@/assets', path.resolve(__dirname, '..', 'src/assets'))
        .set('@/styles', path.resolve(__dirname, '..', 'src/styles'))
        .set('@/utils', path.resolve(__dirname, '..', 'src/utils'))
        .set('@/types', path.resolve(__dirname, '..', 'src/types'));
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
EOF

# 如果dev.js和prod.js不存在，创建它们
if [ ! -f "config/dev.js" ]; then
  cat > config/dev.js << 'EOF'
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  mini: {},
  h5: {}
};
EOF
fi

if [ ! -f "config/prod.js" ]; then
  cat > config/prod.js << 'EOF'
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  mini: {
    optimizeMainPackage: {
      enable: true
    }
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考文档：https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    webpackChain(chain) {
      chain.plugin('analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [
          {
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'report.html'
          }
        ]);
    }
  }
};
EOF
fi

### 2. 修改产品列表页，使用相对路径

# 备份当前文件
cp src/pages/product/list/index.jsx src/pages/product/list/index.jsx.bak 2>/dev/null || true
cp src/pages/product/list/index.tsx src/pages/product/list/index.tsx.bak 2>/dev/null || true

# 检查文件是JSX还是TSX
if [ -f "src/pages/product/list/index.tsx" ]; then
  PRODUCT_LIST_FILE="src/pages/product/list/index.tsx"
else
  PRODUCT_LIST_FILE="src/pages/product/list/index.jsx"
fi

# 修改产品列表页文件
cat > $PRODUCT_LIST_FILE << 'EOF'
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
// 改用相对路径导入，不使用别名
import { ProductCard } from '../../../components'
import './index.scss'

const ProductList = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('default')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [filter])
  
  const fetchProducts = async () => {
    try {
      setLoading(true)
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const newProducts = Array(10).fill().map((_, i) => ({
          id: `prod-${page}-${i}`,
          name: `商品 ${page}-${i+1}`,
          price: Math.floor(Math.random() * 1000) + 100,
          image: `https://picsum.photos/300/300?random=${page}${i}`,
          category: '摄影',
          sales: Math.floor(Math.random() * 100)
        }))
        
        if (page === 1) {
          setProducts(newProducts)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }
        
        setHasMore(page < 3) // 模拟只有3页数据
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('获取商品列表失败:', error)
      setLoading(false)
    }
  }
  
  const handleFilterChange = (newFilter) => {
    if (filter === newFilter) return
    setFilter(newFilter)
    setPage(1)
  }
  
  const handleLoadMore = () => {
    if (!hasMore || loading) return
    setPage(prev => prev + 1)
    fetchProducts()
  }
  
  const handleProductClick = (productId) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    })
  }
  
  return (
    <View className='product-list-page'>
      {/* 筛选栏 */}
      <View className='filter-bar'>
        <View 
          className={`filter-item ${filter === 'default' ? 'active' : ''}`}
          onClick={() => handleFilterChange('default')}
        >
          默认排序
        </View>
        <View 
          className={`filter-item ${filter === 'sales' ? 'active' : ''}`}
          onClick={() => handleFilterChange('sales')}
        >
          销量优先
        </View>
        <View 
          className={`filter-item ${filter === 'price' ? 'active' : ''}`}
          onClick={() => handleFilterChange('price')}
        >
          价格
          <Text className='filter-icon'>↑↓</Text>
        </View>
      </View>
      
      {/* 商品列表 */}
      <ScrollView
        className='product-scroll'
        scrollY
        onScrollToLower={handleLoadMore}
      >
        {products.length > 0 ? (
          <View className='product-grid'>
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </View>
        ) : (
          <View className='empty-list'>
            <Image className='empty-image' src='https://img.icons8.com/clouds/100/000000/box.png' />
            <Text className='empty-text'>暂无商品</Text>
          </View>
        )}
        
        {hasMore && (
          <View className='loading-status'>
            {loading ? '加载中...' : '上拉加载更多'}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default ProductList
EOF

echo "=== 清理项目缓存 ==="
rm -rf .temp
rm -rf .cache
rm -rf dist

echo "=== 修复完成 ==="
echo "请执行以下命令重新编译项目:"
echo "yarn dev:weapp"
