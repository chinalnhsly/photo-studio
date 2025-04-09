import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 改用 JSDoc 注释代替 TypeScript interface
/**
 * @typedef {Object} ProductCardProps
 * @property {string} id - 商品ID
 * @property {string} name - 商品名称
 * @property {string} image - 商品图片
 * @property {number} price - 商品价格
 * @property {number} [originalPrice] - 商品原价（可选）
 * @property {number} [sales] - 销量（可选）
 * @property {string} [category] - 商品分类（可选）
 */

/**
 * 商品卡片组件
 * @param {ProductCardProps} props
 */
function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  sales = 0,
  category
}) {
  const handleClick = () => {
    // 跳转到商品详情页
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${id}`
    })
  }

  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0

  return (
    <View className='product-card' onClick={handleClick}>
      <View className='product-image-wrapper'>
        <Image 
          className='product-image' 
          src={image} 
          mode='aspectFill' 
          lazyLoad
        />
        {category && <View className='product-tag'>{category}</View>}
      </View>
      <View className='product-info'>
        <Text className='product-name'>{name}</Text>
        <View className='product-price-row'>
          <Text className='product-price'>¥{price}</Text>
          {originalPrice && originalPrice > price && (
            <Text className='product-original-price'>¥{originalPrice}</Text>
          )}
        </View>
        <View className='product-bottom-row'>
          {discount > 0 && <Text className='product-discount'>{discount}%折</Text>}
          {sales > 0 && <Text className='product-sales'>已售{sales}件</Text>}
        </View>
      </View>
    </View>
  )
}

export default ProductCard
