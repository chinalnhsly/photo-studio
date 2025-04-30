import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 将TypeScript接口转换为JavaScript注释
/**
 * @typedef {Object} TimeSlot
 * @property {string} time - 时间段
 * @property {boolean} available - 是否可用
 */

/**
 * @typedef {Object} AppointmentCardProps
 * @property {string} title - 预约标题
 * @property {string} image - 预约图片
 * @property {Array<TimeSlot>} timeSlots - 可用时间段
 */

/**
 * 预约卡片组件
 * @param {AppointmentCardProps} props
 */
const AppointmentCard = (props) => {
  const { title, image, timeSlots } = props
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  // 可用时间段数据
  const availableSlots = timeSlots || [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: false },
    { time: '15:00', available: true },
  ]
  
  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot)
    }
  }
  
  const handleAppointment = () => {
    if (!selectedSlot) {
      Taro.showToast({ title: '请选择预约时间', icon: 'none' })
      return
    }
    
    Taro.showToast({ 
      title: `已预约${selectedSlot.time}`, 
      icon: 'success',
      duration: 2000
    })
  }
  
  return (
    <View className='appointment-card'>
      <Text className='appointment-title'>{title || '预约服务'}</Text>
      
      <View className='time-slots'>
        {availableSlots.map((slot, index) => (
          <View 
            key={index}
            className={`time-slot ${slot.available ? 'available' : 'unavailable'} ${selectedSlot === slot ? 'selected' : ''}`}
            onClick={() => handleSlotSelect(slot)}
          >
            <Text className='time'>{slot.time}</Text>
            <Text className='status'>{slot.available ? '可约' : '已满'}</Text>
          </View>
        ))}
      </View>
      
      <Button 
        className='appointment-button'
        disabled={!selectedSlot}
        onClick={handleAppointment}
      >
        立即预约
      </Button>
    </View>
  )
}

export default AppointmentCard
