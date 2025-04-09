import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Calendar from '../../../../components/Calendar'
import './index.scss'

interface TimeSlot {
  time: string
  available: boolean
}

const AppointmentCard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  // 根据选择的日期更新可用时间段
  useEffect(() => {
    if (selectedDate) {
      // 模拟获取时间段数据
      const slots: TimeSlot[] = [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true },
        { time: '15:00', available: true },
        { time: '16:00', available: true }
      ]
      setTimeSlots(slots)
    }
  }, [selectedDate])

  const handleTimeSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setTimeSlots(prev => 
        prev.map(s => ({
          ...s,
          available: s.time === slot.time ? false : s.available
        }))
      )
    }
  }

  return (
    <View className='appointment-card'>
      <View className='header'>
        <Text className='title'>在线预约</Text>
      </View>
      <Calendar 
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <View className='time-slots'>
        {timeSlots.map(slot => (
          <View 
            key={slot.time}
            className={`slot ${slot.available ? 'available' : 'disabled'}`}
            onClick={() => handleTimeSelect(slot)}
          >
            {slot.time}
          </View>
        ))}
      </View>
    </View>
  )
}

export default AppointmentCard
