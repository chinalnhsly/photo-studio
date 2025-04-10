import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './success.scss'

// 成功图标
const successIcon = 'https://img.icons8.com/fluency/96/000000/checked.png'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const { orderId } = router.params
  
  const [paymentTime] = useState(new Date().toLocaleString())
  const [orderAmount] = useState('3699.00')
  
  // 查看订单
  const viewOrder = () => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${orderId}`
    })
  }
  
  // 返回首页
  const backToHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }

  return (
    <View className='payment-success'>
      <View className='success-header'>
        <Image className='success-icon' src={successIcon} />
        <Text className='success-title'>支付成功</Text>
        <Text className='success-desc'>感谢您的预订，期待为您提供服务</Text>
      </View>
      
      <View className='order-info'>
        <View className='info-row'>
          <Text className='info-label'>订单编号</Text>
          <Text className='info-value'>{orderId}</Text>
        </View>
        
        <View className='info-row'>
          <Text className='info-label'>支付金额</Text>
          <Text className='info-value price'>¥{orderAmount}</Text>
        </View>
        
        <View className='info-row'>
          <Text className='info-label'>支付时间</Text>
          <Text className='info-value'>{paymentTime}</Text>
        </View>
        
        <View className='info-row'>
          <Text className='info-label'>支付方式</Text>
          <Text className='info-value'>微信支付</Text>
        </View>
      </View>
      
      <View className='tips-section'>
        <View className='tips-title'>温馨提示</View>
        <View className='tips-content'>
          <View className='tips-item'>
            <View className='tip-dot'></View>
            <Text className='tip-text'>订单详情可在"我的-我的预约"中查看</Text>
          </View>
          <View className='tips-item'>
            <View className='tip-dot'></View>
            <Text className='tip-text'>如需取消或变更预约，请提前24小时联系客服</Text>
          </View>
          <View className='tips-item'>
            <View className='tip-dot'></View>
            <Text className='tip-text'>拍摄当天请携带有效证件，准时到店</Text>
          </View>
        </View>
      </View>
      
      <View className='action-buttons'>
        <Button className='action-btn view-order' onClick={viewOrder}>
          查看订单
        </Button>
        <Button className='action-btn back-home' onClick={backToHome}>
          返回首页
        </Button>
      </View>
      
      {/* 下方营销组件 */}
      <View className='marketing-section'>
        <View className='marketing-title'>— 为您推荐 —</View>
        <View className='coupon-banner' onClick={() => Taro.navigateTo({ url: '/pages/marketing/coupons' })}>
          <Image className='coupon-icon' src='https://img.icons8.com/doodle/48/000000/discount--v1.png' />
          <View className='coupon-content'>
            <Text className='coupon-title'>新人专享券</Text>
            <Text className='coupon-desc'>满1000减100，立即领取</Text>
          </View>
          <View className='coupon-btn'>领取</View>
        </View>
      </View>
    </View>
  )
}
