import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

/**
 * 商品卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.product - 商品信息
 * @param {string} props.product.id - 商品ID
 * @param {string} props.product.title - 商品标题
 * @param {number} props.product.price - 商品价格
 * @param {string} [props.product.image] - 商品图片
 * @param {number} [props.product.originalPrice] - 原价
 * @param {number} [props.product.sales] - 销量
 */
const ProductCard = ({ product, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      // 默认跳转到商品详情页
      Taro.navigateTo({
        url: `/pages/product/detail/index?id=${product.id}`
      });
    }
  };
  
  return (
    <View className='product-card' onClick={handleClick}>
      <Image 
        className='product-image' 
        src={product.image || 'https://placehold.co/300x200/f5f5f5/999?text=暂无图片'} 
        mode='aspectFill'
      />
      <View className='product-info'>
        <Text className='title'>{product.title}</Text>
        <View className='price-row'>
          <Text className='price'>¥{product.price}</Text>
          {product.originalPrice && (
            <Text className='original-price'>¥{product.originalPrice}</Text>
          )}
        </View>
        {product.sales && <Text className='sales'>已售 {product.sales}</Text>}
      </View>
    </View>
  );
};

export default ProductCard;
