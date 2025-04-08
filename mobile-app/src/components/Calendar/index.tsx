import { View, Text } from '@tarojs/components'
import { useState, useCallback} from 'react'
import type { CalendarProps, DayElement } from './types'
import './index.scss'

const Calendar = ({ value, onChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(value || new Date())

  // 辅助函数
  const getDaysInMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }, [])

  const getFirstDayOfMonth = useCallback((date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }, [])

  // 事件处理函数
  const handleMonthChange = useCallback((delta: number) => {
    setCurrentMonth(prev => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + delta)
      return next
    })
  }, [])

  const onDateSelect = useCallback((date: Date) => {
    onChange?.(date)
  }, [onChange])

  // 渲染函数
  const renderCalendarGrid = useCallback((): DayElement[] => {
    const days = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const totalDays: DayElement[] = []

    // 填充空白格子
    for (let i = 0; i < firstDay; i++) {
      totalDays.push(
        <View key={`empty-${i}`} className='calendar-day empty'>
          <Text></Text>
        </View>
      )
    }

    // 填充日期格子
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = value?.getDate() === day
      
      totalDays.push(
        <View 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => onDateSelect(date)}
        >
          <Text>{day}</Text>
        </View>
      )
    }

    return totalDays
  }, [currentMonth, value, getDaysInMonth, getFirstDayOfMonth, onDateSelect])

  return (
    <View className='calendar'>
      <View className='calendar-header'>
        <Text onClick={() => handleMonthChange(-1)}>{'<'}</Text>
        <Text>
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </Text>
        <Text onClick={() => handleMonthChange(1)}>{'>'}</Text>
      </View>
      <View className='calendar-grid'>
        {renderCalendarGrid()}
      </View>
    </View>
  )
}

export default Calendar
