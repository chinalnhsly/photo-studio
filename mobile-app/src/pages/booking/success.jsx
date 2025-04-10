import React from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './success.scss'

// 预约成功图标
const successIcon = 'https://img.icons8.com/color/96/000000/ok--v1.png'

export default function BookingSuccessPage() {
  const router = useRouter()
  const { id } = router.params
  
  // 返回首页
  const handleBackHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }
  
  // 查看预约详情
  const handleViewBooking = () => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${id}`
    })
  }

  return (
    <View className='success-page'>
      <View className='success-card'>
        <Image className='success-icon' src={successIcon} />
        <Text className='success-title'>预约成功！</Text>
        <Text className='success-desc'>您的预约已确认，请按时到店</Text>
        <Text className='success-id'>预约单号: {id}</Text>
        
        <View className='tips-section'>
          <Text className='tips-title'>温馨提示</Text>
          <View className='tips-item'>
            <Text className='tips-dot'>•</Text>
            <Text className='tips-text'>请提前10分钟到达影楼</Text>
          </View>
          <View className='tips-item'>
            <Text className='tips-dot'>•</Text>
            <Text className='tips-text'>可提前1天准备好服装或着装要求</Text>
          </View>
          <View className='tips-item'>
            <Text className='tips-dot'>•</Text>
            <Text className='tips-text'>如需变更预约，请提前24小时联系客服</Text>
          </View>
        </View>
      </View>
      
      <View className='action-buttons'>
        <Button className='action-btn home' onClick={handleBackHome}>返回首页</Button>
        <Button className='action-btn detail' onClick={handleViewBooking}>查看详情</Button>
      </View>
    </View>
  )
}
