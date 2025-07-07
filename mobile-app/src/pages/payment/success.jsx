import React, { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './success.scss'

const PaymentSuccess = () => {
  const router = useRouter()
  const { orderId, amount } = router.params
  const [countDown, setCountDown] = useState(5)
  
  // 倒计时自动跳转
  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // 倒计时结束后处理
  useEffect(() => {
    if (countDown === 0) {
      Taro.navigateTo({
        url: '/pages/user/bookings/index'
      })
    }
  }, [countDown])
  
  // 前往我的预约
  const handleViewBookings = () => {
    Taro.navigateTo({
      url: '/pages/user/bookings/index'
    })
  }
  
  // 返回首页
  const handleGoHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }
  
  return (
    <View className='payment-success-page'>
      <View className='success-icon-wrap'>
        <View className='success-icon'>✓</View>
      </View>
      
      <View className='success-info'>
        <Text className='success-title'>支付成功</Text>
        <Text className='success-amount'>¥{amount || '--'}</Text>
        <Text className='success-desc'>订单号: {orderId || '--'}</Text>
      </View>
      
      <View className='notice-box'>
        <View className='notice-header'>
          <View className='notice-line' />
          <Text className='notice-title'>温馨提示</Text>
          <View className='notice-line' />
        </View>
        
        <View className='notice-content'>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>预约时间前48小时内取消将收取30%违约金</Text>
          </View>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>请在预约时间提前15分钟到店，做好准备</Text>
          </View>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>如有其他问题，请联系客服: 400-123-4567</Text>
          </View>
        </View>
      </View>
      
      <View className='countdown-tips'>
        <Text>{countDown}秒后自动跳转到"我的预约"</Text>
      </View>
      
      <View className='action-buttons'>
        <Button 
          className='action-btn home'
          onClick={handleGoHome}
        >
          返回首页
        </Button>
        
        <Button 
          className='action-btn view'
          onClick={handleViewBookings}
        >
          查看我的预约
        </Button>
      </View>
    </View>
  )
}

export default PaymentSuccess
