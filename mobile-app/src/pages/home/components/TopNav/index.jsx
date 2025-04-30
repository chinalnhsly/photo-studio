import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

// 提供两种导出方式，确保兼容性
export const TopNav = (props) => {
  return (
    <View className='top-nav'>
      <Text className='title'>{props.title || '影楼商城'}</Text>
    </View>
  );
};

export default TopNav;
