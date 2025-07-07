import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function User() {
  const user = {
    avatar: 'https://placehold.co/100/E6E6FA/333?text=头像',
    name: '张三',
    level: 'VIP会员'
  };
  
  const menuItems = [
    { id: 1, name: '我的订单', icon: '📝' },
    { id: 2, name: '我的预约', icon: '📅' },
    { id: 3, name: '我的收藏', icon: '⭐' },
    { id: 4, name: '优惠券', icon: '🎟️' },
    { id: 5, name: '联系客服', icon: '📞' },
    { id: 6, name: '设置', icon: '⚙️' }
  ];
  
  const handleMenuClick = (id) => {
    Taro.showToast({
      title: `点击了菜单${id}`,
      icon: 'none'
    });
  };
  
  return (
    <View className='user-page'>
      <View className='user-header'>
        <Image className='avatar' src={user.avatar} />
        <View className='user-info'>
          <Text className='username'>{user.name}</Text>
          <Text className='user-level'>{user.level}</Text>
        </View>
      </View>
      
      <View className='menu-list'>
        {menuItems.map(item => (
          <View 
            key={item.id}
            className='menu-item'
            onClick={() => handleMenuClick(item.id)}
          >
            <Text className='menu-icon'>{item.icon}</Text>
            <Text className='menu-name'>{item.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
