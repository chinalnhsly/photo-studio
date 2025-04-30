import React from 'react';
import { View, Text } from '@tarojs/components';

// 占位组件
const BannerFallback = () => {
  return (
    <View style={{ height: '150px', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Text>轮播图未加载</Text>
    </View>
  );
};

export default BannerFallback;
