import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟预约数据
const mockBookings = [
  {
    id: 'booking1',
    productName: '婚纱照套餐',
    status: 'completed',
    bookingDate: '2023-06-15',
    timeSlot: '上午 9:00-12:00',
    price: 3999,
    coverImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg'
  },
  {
    id: 'booking2',
    productName: '情侣写真',
    status: 'upcoming',
    bookingDate: '2023-08-20',
    timeSlot: '下午 14:00-16:00',
    price: 1599,
    coverImage: 'https://img.freepik.com/free-photo/smiley-woman-posing-outdoors_23-2148895799.jpg'
  },
  {
    id: 'booking3',
    productName: '儿童写真',
    status: 'cancelled',
    bookingDate: '2023-07-10',
    timeSlot: '上午 10:00-11:30',
    price: 999,
    coverImage: 'https://img.freepik.com/free-photo/full-shot-kid-taking-photos_23-2149029007.jpg'
  }
]

// 状态标签颜色和文本
const statusConfig = {
  upcoming: { text: '待拍摄', color: '#ff9f43' },
  completed: { text: '已完成', color: '#2ecc71' },
  cancelled: { text: '已取消', color: '#999999' }
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 500)
  }, [])
  
  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab)
  
  const handleBookingClick = (bookingId) => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${bookingId}`
    })
  }

  return (
    <View className='bookings-page'>
      <View className='tabs'>
        <View 
          className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
        <View 
          className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          待拍摄
        </View>
        <View 
          className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          已完成
        </View>
        <View 
          className={`tab-item ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          已取消
        </View>
      </View>
      
      {loading ? (
        <View className='loading'>加载中...</View>
      ) : (
        <View className='booking-list'>
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <View 
                key={booking.id} 
                className='booking-card'
                onClick={() => handleBookingClick(booking.id)}
              >
                <Image className='booking-image' src={booking.coverImage} mode='aspectFill' />
                <View className='booking-info'>
                  <View className='booking-header'>
                    <Text className='booking-name'>{booking.productName}</Text>
                    <Text 
                      className='booking-status'
                      style={{color: statusConfig[booking.status].color}}
                    >
                      {statusConfig[booking.status].text}
                    </Text>
                  </View>
                  <View className='booking-details'>
                    <Text className='booking-date'>
                      预约日期：{booking.bookingDate}
                    </Text>
                    <Text className='booking-time'>
                      预约时间：{booking.timeSlot}
                    </Text>
                    <Text className='booking-price'>
                      ¥{booking.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='empty-list'>
              <Image 
                className='empty-icon'
                src='https://img.icons8.com/clouds/100/000000/calendar.png'
              />
              <Text className='empty-text'>暂无预约记录</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default BookingsPage
