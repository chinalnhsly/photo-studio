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
