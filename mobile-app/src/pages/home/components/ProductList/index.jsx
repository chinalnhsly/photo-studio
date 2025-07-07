import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/store/reducers/product'
// 使用JSDoc替代TypeScript类型导入
// // import type { BaseProduct } from '@/types/product'
import './index.scss'

/**
 * @typedef {Object} BaseProduct
 * @property {string} id - 产品ID
 * @property {string} title - 产品标题
 * @property {number} price - 产品价格
 * @property {string} [image] - 产品图片
 * @property {number} [originalPrice] - 原价
 * @property {number} [sales] - 销量
 */

const ProductList = () => {
  const [loading, setLoading] = useState(true)
  
  // 模拟产品数据
  const [products, setProducts] = useState([
    {
      id: '1',
      title: '韩式婚纱摄影',
      price: 3999,
      image: 'https://placehold.co/300x200/E6E6FA/333?text=婚纱套餐',
      originalPrice: 5999,
      sales: 128
    },
    {
      id: '2',
      title: '小清新写真',
      price: 999,
      image: 'https://placehold.co/300x200/FFF8DC/333?text=写真套餐',
      originalPrice: 1599,
      sales: 256
    },
    {
      id: '3',
      title: '全家福套餐',
      price: 1299,
      image: 'https://placehold.co/300x200/F0FFF0/333?text=全家福',
      originalPrice: 1999,
      sales: 86
    }
  ])
  
  useEffect(() => {
    // 模拟加载
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])
  
  if (loading) {
    return (
      <View className='product-list loading'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  if (products.length === 0) {
    return (
      <View className='product-list empty'>
        <Text>暂无商品</Text>
      </View>
    )
  }
  
  return (
    <View className='product-list'>
      {products.map(product => (
        <View key={product.id} className='product-item'>
          <View className='product-image'>
            {product.image && <img src={product.image} alt={product.title} />}
          </View>
          <View className='product-info'>
            <Text className='product-title'>{product.title}</Text>
            <View className='price-row'>
              <Text className='product-price'>¥{product.price}</Text>
              {product.originalPrice && (
                <Text className='original-price'>¥{product.originalPrice}</Text>
              )}
            </View>
            {product.sales && <Text className='sales'>已售 {product.sales}</Text>}
          </View>
        </View>
      ))}
    </View>
  )
}

export default ProductList
