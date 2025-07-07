import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function Category() {
  const categories = [
    { id: '1', name: '婚纱摄影' },
    { id: '2', name: '写真套餐' },
    { id: '3', name: '全家福' },
    { id: '4', name: '儿童摄影' }
  ];
  
  return (
    <View className='category-page'>
      <Text className='category-title'>商品分类</Text>
      <View className='category-list'>
        {categories.map(category => (
          <View key={category.id} className='category-item'>
            <Text className='category-name'>{category.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
