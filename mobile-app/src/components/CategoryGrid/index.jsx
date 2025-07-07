import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

/**
 * 分类网格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.categories - 分类列表
 */
const CategoryGrid = ({ categories = [] }) => {
  const defaultCategories = categories.length > 0 ? categories : [
    { id: '1', name: '婚纱摄影', icon: 'https://placehold.co/80x80/FFC0CB/fff?text=婚纱' },
    { id: '2', name: '写真套餐', icon: 'https://placehold.co/80x80/E6E6FA/fff?text=写真' },
    { id: '3', name: '全家福', icon: 'https://placehold.co/80x80/F0FFF0/fff?text=全家福' },
    { id: '4', name: '儿童摄影', icon: 'https://placehold.co/80x80/FFFACD/fff?text=儿童' },
    { id: '5', name: '形象照', icon: 'https://placehold.co/80x80/E0FFFF/fff?text=形象照' },
    { id: '6', name: '艺术照', icon: 'https://placehold.co/80x80/FFF0F5/fff?text=艺术照' },
    { id: '7', name: '闺蜜照', icon: 'https://placehold.co/80x80/F0F8FF/fff?text=闺蜜' },
    { id: '8', name: '更多服务', icon: 'https://placehold.co/80x80/F5F5F5/999?text=更多' }
  ];
  
  return (
    <View className='category-grid'>
      {defaultCategories.map(category => (
        <View key={category.id} className='category-item'>
          <Image className='category-icon' src={category.icon} mode='aspectFill' />
          <Text className='category-name'>{category.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default CategoryGrid;
