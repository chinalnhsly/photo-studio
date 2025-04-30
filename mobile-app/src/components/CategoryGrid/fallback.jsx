import React from 'react';
import { View, Text } from '@tarojs/components';

// 占位组件
const CategoryGridFallback = () => {
  return (
    <View style={{ padding: '20px', textAlign: 'center' }}>
      <Text>分类组件未加载</Text>
    </View>
  );
};

export default CategoryGridFallback;
