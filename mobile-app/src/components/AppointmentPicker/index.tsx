import { View, Text } from '@tarojs/components'
import { Calendar } from '@/components'
import { useState } from 'react'
import type { AppointmentSlot } from '@/types/business'
import './index.scss'

interface Props {
  slots: AppointmentSlot[]
  onSelect: (slot: AppointmentSlot) => void
}

const AppointmentPicker: React.FC<Props> = ({ slots, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot>()

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(undefined)
  }

  const handleSlotSelect = (slot: AppointmentSlot) => {
    if (slot.status === 'available' && (slot.maxQuota - slot.bookedQuota) > 0) {
      setSelectedSlot(slot)
      onSelect(slot)
    }
  }

  // 根据选择的日期筛选可用时段
  const availableSlots = slots.filter(slot => {
    if (!selectedDate) return false
    return slot.date === selectedDate.toISOString().split('T')[0]
  })

  return (
    <View className='appointment-picker'>
      <Calendar 
        value={selectedDate}
        onChange={handleDateSelect}
      />
      <View className='time-slots'>
        {availableSlots.map(slot => (
          <View 
            key={slot.id}
            className={`slot ${slot.status} ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
            onClick={() => handleSlotSelect(slot)}
          >
            <Text>{slot.startTime}-{slot.endTime}</Text>
            <Text className='quota'>剩余:{slot.maxQuota - slot.bookedQuota}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default AppointmentPicker
