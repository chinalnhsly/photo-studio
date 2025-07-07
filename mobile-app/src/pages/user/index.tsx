import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon, AtAvatar, AtBadge } from 'taro-ui';
import { getUserProfile, logout } from '../../services/user';
import './index.scss';

const UserCenter: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = Taro.getStorageSync('token');
        
        if (!token) {
          setUserInfo(null);
          return;
        }
        
        const res = await getUserProfile();
        setUserInfo(res.data);
        
        // 获取未读消息数等其他数据
        // ...
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);
  
  // 处理登录/注册
  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' });
  };
  
  // 处理退出登录
  const handleLogout = async () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout();
            Taro.removeStorageSync('token');
            setUserInfo(null);
            Taro.showToast({
              title: '已退出登录',
              icon: 'success'
            });
          } catch (error) {
            console.error('退出登录失败:', error);
          }
        }
      }
    });
  };
  
  // 功能入口项目
  const menuItems = [
    {
      title: '我的订单',
      icon: 'shopping-bag',
      color: '#1890ff',
      path: '/pages/order/list/index',
      showBadge: false
    },
    {
      title: '优惠券',
      icon: 'ticket',
      color: '#ff4d4f',
      path: '/pages/user/coupons/index',
      showBadge: false
    },
    {
      title: '收藏夹',
      icon: 'heart',
      color: '#f759ab',
      path: '/pages/user/favorite/index',
      showBadge: false
    },
    {
      title: '我的评价',
      icon: 'star',
      color: '#faad14',
      path: '/pages/user/reviews/index',
      showBadge: false
    },
    {
      title: '地址管理',
      icon: 'map-pin',
      color: '#52c41a',
      path: '/pages/user/address/index',
      showBadge: false
    },
    {
      title: '消息中心',
      icon: 'message',
      color: '#722ed1',
      path: '/pages/user/messages/index',
      showBadge: unreadCount > 0,
      badgeValue: unreadCount
    },
    {
      title: '账号设置',
      icon: 'settings',
      color: '#666666',
      path: '/pages/user/settings/index',
      showBadge: false
    }
  ];
  
  return (
    <View className="user-center-page">
      {/* 用户信息块 */}
      <View className="user-info-block">
        {userInfo ? (
          <View className="user-info">
            <AtAvatar circle image={userInfo.avatar || '/assets/images/default-avatar.png'} />
            <View className="user-details">
              <Text className="user-name">{userInfo.username}</Text>
              <Text className="user-id">ID: {userInfo.id}</Text>
            </View>
            <View className="logout-button" onClick={handleLogout}>
              <AtIcon value="logout" size="18" color="#999" />
            </View>
          </View>
        ) : (
          <View className="login-prompt">
            <AtAvatar circle image="/assets/images/default-avatar.png" />
            <View className="login-text">
              <Text>请登录/注册</Text>
            </View>
            <View className="login-button" onClick={handleLogin}>
              <Text>登录</Text>
              <AtIcon value="chevron-right" size="16" color="#999" />
            </View>
          </View>
        )}
      </View>
      
      {/* 订单状态卡片 */}
      <View className="order-status-card">
        <View className="card-header">
          <Text className="card-title">我的订单</Text>
          <View 
            className="view-all" 
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index' })}
          >
            <Text>全部订单</Text>
            <AtIcon value="chevron-right" size="14" color="#999" />
          </View>
        </View>
        
        <View className="order-types">
          <View 
            className="order-type-item" 
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index?status=pending' })}
          >
            <AtIcon value="credit-card" size="24" color="#1890ff" />
            <Text>待付款</Text>
          </View>
          <View 
            className="order-type-item" 
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index?status=processing' })}
          >
            <AtIcon value="calendar" size="24" color="#52c41a" />
            <Text>待拍摄</Text>
          </View>
          <View 
            className="order-type-item" 
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index?status=delivering' })}
          >
            <AtIcon value="image" size="24" color="#faad14" />
            <Text>待取片</Text>
          </View>
          <View 
            className="order-type-item" 
            onClick={() => Taro.navigateTo({ url: '/pages/order/list/index?status=completed' })}
          >
            <AtIcon value="star" size="24" color="#ff4d4f" />
            <Text>待评价</Text>
          </View>
        </View>
      </View>
      
      {/* 功能菜单 */}
      <View className="menu-section">
        {menuItems.map((item, index) => (
          <View 
            key={index} 
            className="menu-item"
            onClick={() => Taro.navigateTo({ url: item.path })}
          >
            <View className="menu-icon" style={{ backgroundColor: item.color }}>
              <AtIcon value={item.icon} size="20" color="#fff" />
            </View>
            <Text className="menu-title">{item.title}</Text>
            {item.showBadge && (
              <AtBadge value={item.badgeValue} maxValue={99} />
            )}
            <AtIcon value="chevron-right" size="16" color="#ddd" />
          </View>
        ))}
      </View>
      
      {/* 客服和帮助中心 */}
      <View className="support-section">
        <Button 
          className="support-button"
          openType="contact"
        >
          <AtIcon value="help" size="18" color="#666" />
          <Text>联系客服</Text>
        </Button>
        
        <View 
          className="support-button"
          onClick={() => Taro.navigateTo({ url: '/pages/help-center/index' })}
        >
          <AtIcon value="help" size="18" color="#666" />
          <Text>帮助中心</Text>
        </View>
      </View>
    </View>
  );
};

export default UserCenter;
