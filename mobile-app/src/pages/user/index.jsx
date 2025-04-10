import React, { useState } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 默认头像
const defaultAvatar = 'https://img.icons8.com/clouds/100/000000/user.png'

export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null)
  
  // 登录处理
  const handleLogin = () => {
    Taro.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        // 模拟登录
        const userData = {
          ...res.userInfo,
          id: 'user_' + Date.now(),
          points: 100,
          level: '普通会员'
        }
        
        setUserInfo(userData)
        Taro.setStorageSync('userInfo', userData)
      },
      fail: () => {
        Taro.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    })
  }
  
  // 菜单项配置
  const menuItems = [
    {
      icon: '📋',
      title: '我的预约',
      url: '/pages/user/bookings/index'
    },
    {
      icon: '📸',
      title: '我的影集',
      url: '/pages/user/albums/index'
    },
    {
      icon: '🎁',
      title: '我的优惠券',
      url: '/pages/user/coupons/index'
    },
    {
      icon: '⭐',
      title: '收藏夹',
      url: '/pages/user/favorites/index'
    }
  ]
  
  // 处理菜单点击
  const handleMenuClick = (url) => {
    if (!userInfo) {
      return Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
    
    Taro.navigateTo({ url })
  }
  
  // 联系客服
  const handleContact = () => {
    // 实际项目中可以使用微信的客服接口
    Taro.showToast({
      title: '拨打客服热线：400-123-4567',
      icon: 'none'
    })
  }
  
  // 退出登录
  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确认退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          setUserInfo(null)
          Taro.removeStorageSync('userInfo')
          Taro.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }

  return (
    <View className='user-page'>
      {/* 用户信息区域 */}
      <View className='user-header'>
        <View className='user-card'>
          {userInfo ? (
            <View className='user-info'>
              <Image className='avatar' src={userInfo.avatarUrl || defaultAvatar} />
              <View className='info-content'>
                <Text className='nickname'>{userInfo.nickName}</Text>
                <Text className='member-info'>{userInfo.level} · {userInfo.points}积分</Text>
              </View>
            </View>
          ) : (
            <View className='login-box'>
              <Image className='avatar' src={defaultAvatar} />
              <Button className='login-btn' onClick={handleLogin}>
                点击登录
              </Button>
            </View>
          )}
        </View>
      </View>
      
      {/* 功能菜单 */}
      <View className='menu-section'>
        <View className='menu-list'>
          {menuItems.map((item, index) => (
            <View 
              key={index} 
              className='menu-item' 
              onClick={() => handleMenuClick(item.url)}
            >
              <Text className='menu-icon'>{item.icon}</Text>
              <Text className='menu-title'>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* 其他功能区域 */}
      <View className='other-section'>
        <View className='section-title'>其他服务</View>
        <View className='other-list'>
          <View className='other-item' onClick={handleContact}>
            <Text className='item-icon'>📞</Text>
            <Text className='item-name'>联系客服</Text>
          </View>
          <View className='other-item'>
            <Text className='item-icon'>🗂️</Text>
            <Text className='item-name'>关于我们</Text>
          </View>
          <View className='other-item'>
            <Text className='item-icon'>⚙️</Text>
            <Text className='item-name'>设置</Text>
          </View>
        </View>
      </View>
      
      {/* 退出登录按钮 */}
      {userInfo && (
        <View className='logout-section'>
          <Button className='logout-btn' onClick={handleLogout}>
            退出登录
          </Button>
        </View>
      )}
    </View>
  )
}
