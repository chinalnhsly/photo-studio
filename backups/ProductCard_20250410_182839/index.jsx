import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

const ProductCard = (props) => {
  const { product } = props;
  
  return (
    <View className='product-card'>
      <View className='product-image-wrapper'>
        <Image className='product-image' src={product.image} mode='aspectFill' />
        {product.tag && <Text className='product-tag'>{product.tag}</Text>}
      </View>
      
      <View className='product-info'>
        {/* 使用Text组件确保文本截断生效 */}
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
