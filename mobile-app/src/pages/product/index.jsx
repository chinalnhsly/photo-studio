import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.scss';

export default function ProductList() {
  const router = useRouter();
  const { shopId } = router.params;
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟API请求获取店铺和产品数据
    setTimeout(() => {
      setShop({
        id: shopId || '1',
        name: shopId === '2' ? '清新写真馆' : (shopId === '3' ? '家庭照相馆' : '星光婚纱摄影'),
        banner: `https://placehold.co/800x200/${shopId === '2' ? 'E6E6FA' : (shopId === '3' ? 'F0FFF0' : 'FFE4E1')}/333?text=${shopId === '2' ? '清新写真' : (shopId === '3' ? '家庭照相' : '星光婚纱')}`
      });
      
      setProducts([
        {
          id: '1',
          name: '韩式婚纱套餐',
          price: 3999,
          originalPrice: 5999,
          image: 'https://placehold.co/300x200/E6E6FA/333?text=婚纱套餐',
          sales: 58
        },
        {
          id: '2',
          name: '小清新写真',
          price: 1299,
          originalPrice: 1699,
          image: 'https://placehold.co/300x200/FFF0F5/333?text=写真套餐',
          sales: 126
        },
        {
          id: '3',
          name: '全家福套餐',
          price: 1999,
          originalPrice: 2899,
          image: 'https://placehold.co/300x200/F0FFF0/333?text=全家福',
          sales: 39
        },
        {
          id: '4',
          name: '儿童摄影',
          price: 999,
          originalPrice: 1299,
          image: 'https://placehold.co/300x200/F0F8FF/333?text=儿童摄影',
          sales: 85
        }
      ]);
      
      setLoading(false);
    }, 800);
  }, [shopId]);
  
  const handleProductClick = (id) => {
    Taro.navigateTo({
      url: `/pages/booking/index?productId=${id}&shopId=${shopId}`
    });
  };
  
  if (loading) {
    return (
      <View className='product-list'>
        <Text className='loading'>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className='product-list'>
      <Image className='shop-banner' src={shop.banner} mode='aspectFill' />
      <View className='shop-name-container'>
        <Text className='shop-name'>{shop.name}</Text>
      </View>
      
      <View className='products-grid'>
        {products.map(product => (
          <View 
            key={product.id} 
            className='product-card'
            onClick={() => handleProductClick(product.id)}
          >
            <Image className='product-image' src={product.image} mode='aspectFill' />
            <View className='product-info'>
              <Text className='product-name'>{product.name}</Text>
              <View className='price-row'>
                <Text className='product-price'>¥{product.price}</Text>
                <Text className='original-price'>¥{product.originalPrice}</Text>
              </View>
              <Text className='sales-text'>已售 {product.sales}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
