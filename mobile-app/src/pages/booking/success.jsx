import React, { useState, useEffect } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './success.scss'

const BookingSuccess = () => {
  const router = useRouter()
  const { orderId } = router.params
  const [orderInfo, setOrderInfo] = useState(null)
  const [countDown, setCountDown] = useState(5)
  
  // 获取订单详情
  useEffect(() => {
    // 模拟获取订单详情
    const fetchOrderInfo = async () => {
      // 模拟API请求
      setTimeout(() => {
        const mockOrderInfo = {
          id: orderId || 'BO1234567890',
          serviceName: '婚纱照套餐',
          date: '2023-10-15',
          time: '14:00-16:00',
          price: 2999,
          status: 'pending'
        }
        
        setOrderInfo(mockOrderInfo)
      }, 500)
    }
    
    fetchOrderInfo()
    
    // 倒计时自动跳转
    const timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // 倒计时结束，跳转到订单详情
          Taro.redirectTo({
            url: `/pages/user/bookings/index`
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [orderId])
  
  // 前往我的预约
  const handleCheckBooking = () => {
    Taro.redirectTo({
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
    <View className='booking-success-page'>
      <View className='success-icon-container'>
        <View className='success-icon'>
          <View className='success-check'>✓</View>
        </View>
      </View>
      
      <Text className='success-title'>预约成功</Text>
      <Text className='success-desc'>您的摄影预约已成功提交，期待为您服务</Text>
      
      {orderInfo && (
        <View className='order-info-card'>
          <Text className='card-title'>预约信息</Text>
          
          <View className='info-row'>
            <Text className='info-label'>订单号</Text>
            <Text className='info-value'>{orderInfo.id}</Text>
          </View>
          
          <View className='info-row'>
            <Text className='info-label'>服务项目</Text>
            <Text className='info-value'>{orderInfo.serviceName}</Text>
          </View>
          
          <View className='info-row'>
            <Text className='info-label'>预约日期</Text>
            <Text className='info-value'>{orderInfo.date}</Text>
          </View>
          
          <View className='info-row'>
            <Text className='info-label'>预约时间</Text>
            <Text className='info-value'>{orderInfo.time}</Text>
          </View>
          
          <View className='info-row'>
            <Text className='info-label'>订单状态</Text>
            <Text className='info-value status'>未支付</Text>
          </View>
          
          <View className='pay-now'>
            <Button 
              className='pay-btn'
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/payment/index?orderId=${orderInfo.id}`
                })
              }}
            >
              立即支付 ¥{orderInfo.price}
            </Button>
          </View>
        </View>
      )}
      
      <View className='countdown-notice'>
        <Text>{countDown}秒后自动跳转到我的预约...</Text>
      </View>
      
      <View className='action-buttons'>
        <Button 
          className='action-btn check'
          onClick={handleCheckBooking}
        >
          查看我的预约
        </Button>
        
        <Button 
          className='action-btn home'
          onClick={handleGoHome}
        >
          返回首页
        </Button>
      </View>
    </View>
  )
}

export default BookingSuccess
