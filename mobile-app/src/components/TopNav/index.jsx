import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

// 命名导出
export const TopNav = (props) => {
  return (
    <View className='top-nav'>
      <Text className='title'>{props.title || '导航'}</Text>
    </View>
  );
};

// 默认导出
export default TopNav;
