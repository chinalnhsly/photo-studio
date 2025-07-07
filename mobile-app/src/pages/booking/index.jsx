import React, { useState, useEffect } from 'react'
import { View, Text, Picker, Input, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { mockApi } from "../../services/mock";
import './index.scss'

export default function BookingPage() {
  const router = useRouter()
  const { productId, productName } = router.params
  
  const [loading, setLoading] = useState(false)
  const [dateList, setDateList] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    remarks: ''
  })

  // 获取可预约日期
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return
      
      try {
        const product = await mockApi.getProductDetail(productId)
        if (product && product.availableDates) {
          const dates = product.availableDates.map(item => item.date)
          setDateList(dates)
          if (dates.length > 0) {
            setSelectedDate(dates[0])
            fetchTimeSlots(dates[0])
          }
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        Taro.showToast({
          title: '获取预约日期失败',
          icon: 'none'
        })
      }
    }
    
    fetchProductDetail()
  }, [productId])

  // 获取时间段
  const fetchTimeSlots = async (date) => {
    try {
      const slots = await mockApi.getAvailableSlots({ 
        productId, 
        date 
      })
      setTimeSlots(slots)
      if (slots.length > 0) {
        setSelectedSlot(slots[0].id)
      } else {
        setSelectedSlot('')
      }
    } catch (error) {
      console.error('获取时间段失败:', error)
    }
  }

  // 日期选择事件
  const handleDateChange = (e) => {
    const index = e.detail.value
    setSelectedDateIndex(index)
    const date = dateList[index]
    setSelectedDate(date)
    fetchTimeSlots(date)
  }
  
  // 时间段选择
  const handleSlotClick = (slotId) => {
    setSelectedSlot(slotId)
  }
  
  // 表单输入变化
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // 提交预约
  const handleSubmit = async () => {
    // 表单验证
    if (!form.name) {
      return Taro.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
    }
    
    if (!form.phone) {
      return Taro.showToast({
        title: '请填写手机号',
        icon: 'none'
      })
    }
    
    if (!/^1[3-9]\d{9}$/.test(form.phone)) {
      return Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
    }
    
    if (!selectedDate || !selectedSlot) {
      return Taro.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    }
    
    // 提交预约
    setLoading(true)
    try {
      const result = await mockApi.createBooking({
        productId,
        date: selectedDate,
        timeSlot: selectedSlot,
        contactName: form.name,
        contactPhone: form.phone,
        remarks: form.remarks
      })
      
      if (result && result.bookingId) {
        Taro.showToast({
          title: '预约成功',
          icon: 'success'
        })
        
        // 延迟跳转到预约成功页面
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/booking/success?id=${result.bookingId}`
          })
        }, 1500)
      }
    } catch (error) {
      console.error('预约失败:', error)
      Taro.showToast({
        title: '预约失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='booking-page'>
      <View className='booking-header'>
        <Text className='booking-title'>预约服务</Text>
        <Text className='booking-product-name'>{productName || '摄影服务'}</Text>
      </View>
      
      {/* 日期选择器 */}
      <View className='booking-section'>
        <Text className='section-title'>选择日期</Text>
        <Picker
          mode='selector'
          range={dateList}
          onChange={handleDateChange}
          value={selectedDateIndex}
        >
          <View className='date-picker'>
            <Text>{selectedDate || '请选择日期'}</Text>
            <Text className='picker-arrow'>▼</Text>
          </View>
        </Picker>
      </View>
      
      {/* 时间段选择 */}
      <View className='booking-section'>
        <Text className='section-title'>选择时间段</Text>
        <View className='time-slot-list'>
          {timeSlots.length > 0 ? (
            timeSlots.map(slot => (
              <View
                key={slot.id}
                className={`time-slot-item ${selectedSlot === slot.id ? 'active' : ''}`}
                onClick={() => handleSlotClick(slot.id)}
              >
                <Text className='time-slot-text'>{slot.startTime} - {slot.endTime}</Text>
              </View>
            ))
          ) : (
            <Text className='no-slots'>当前日期没有可用时间段</Text>
          )}
        </View>
      </View>
      
      {/* 联系信息 */}
      <View className='booking-section'>
        <Text className='section-title'>联系信息</Text>
        <View className='form-item'>
          <Text className='form-label'>姓名</Text>
          <Input
            className='form-input'
            placeholder='请输入您的姓名'
            value={form.name}
            onInput={e => handleInputChange('name', e.detail.value)}
          />
        </View>
        <View className='form-item'>
          <Text className='form-label'>手机号</Text>
          <Input
            className='form-input'
            placeholder='请输入您的手机号'
            type='number'
            maxlength={11}
            value={form.phone}
            onInput={e => handleInputChange('phone', e.detail.value)}
          />
        </View>
        <View className='form-item'>
          <Text className='form-label'>备注</Text>
          <Input
            className='form-input'
            placeholder='其他需求（选填）'
            value={form.remarks}
            onInput={e => handleInputChange('remarks', e.detail.value)}
          />
        </View>
      </View>
      
      {/* 提交按钮 */}
      <View className='booking-submit'>
        <Button 
          className='submit-btn' 
          loading={loading}
          onClick={handleSubmit}
        >
          确认预约
        </Button>
      </View>
    </View>
  )
}
