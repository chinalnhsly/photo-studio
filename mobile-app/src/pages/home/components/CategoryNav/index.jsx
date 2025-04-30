import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';

// 提供两种导出方式，确保兼容性
export const CategoryNav = (props) => {
  const categories = props.categories || [
    { id: '1', name: '全部' },
    { id: '2', name: '婚纱摄影' },
    { id: '3', name: '写真套餐' },
    { id: '4', name: '儿童摄影' },
    { id: '5', name: '全家福' }
  ];
  
  return (
    <ScrollView className='category-nav' scrollX>
      {categories.map(item => (
        <View key={item.id} className='category-item'>
          <Text>{item.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CategoryNav;
