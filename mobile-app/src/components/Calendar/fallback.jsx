import React from 'react';
import { View, Text } from '@tarojs/components';

// 占位组件
const CalendarFallback = () => {
  return (
    <View style={{ padding: '20px', textAlign: 'center' }}>
      <Text>日历组件未加载</Text>
    </View>
  );
};

export default CalendarFallback;
