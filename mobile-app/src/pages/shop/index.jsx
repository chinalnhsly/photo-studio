import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      setShops([
        {
          id: '1',
          name: '星光婚纱摄影',
          address: '北京市朝阳区星光大道88号',
          rating: 4.8,
          image: 'https://placehold.co/400x300/FFE4E1/333?text=星光婚纱',
          distance: '2.3km'
        },
        {
          id: '2',
          name: '清新写真馆',
          address: '北京市海淀区大学路66号',
          rating: 4.5,
          image: 'https://placehold.co/400x300/E6E6FA/333?text=清新写真',
          distance: '3.1km'
        },
        {
          id: '3',
          name: '家庭照相馆',
          address: '北京市西城区家园路102号',
          rating: 4.9,
          image: 'https://placehold.co/400x300/F0FFF0/333?text=家庭照相',
          distance: '4.5km'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);
  
  const handleShopClick = (id) => {
    Taro.navigateTo({
      url: `/pages/product/index?shopId=${id}`
    });
  };
  
  if (loading) {
    return (
      <View className='shop-list'>
        <Text className='loading'>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className='shop-list'>
      <View className='page-header'>
        <Text className='page-title'>附近影楼</Text>
      </View>
      
      <ScrollView className='shops-container' scrollY>
        {shops.map(shop => (
          <View 
            key={shop.id} 
            className='shop-card'
            onClick={() => handleShopClick(shop.id)}
          >
            <Image className='shop-image' src={shop.image} mode='aspectFill' />
            <View className='shop-info'>
              <View className='shop-header'>
                <Text className='shop-name'>{shop.name}</Text>
                <Text className='shop-rating'>★ {shop.rating}</Text>
              </View>
              <Text className='shop-address'>{shop.address}</Text>
              <Text className='shop-distance'>{shop.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
