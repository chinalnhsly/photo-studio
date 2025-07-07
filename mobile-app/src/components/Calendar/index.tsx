import React, { useState, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import type { ViewProps } from '@tarojs/components'
import type { CalendarProps, DayProps } from './types'
import './index.scss'

// 日期组件
const CalendarDay: React.FC<DayProps & ViewProps> = ({ 
  date, 
  isSelected, 
  isEmpty,
  ...props 
}) => {
  if (isEmpty) {
    return <View className='calendar-day empty' {...props} />
  }

  return (
    <View 
      className={`calendar-day ${isSelected ? 'selected' : ''}`} 
      {...props}
    >
      <Text>{date?.getDate()}</Text>
    </View>
  )
}

// 日历组件
export const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
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

  // 渲染日历网格
  const renderCalendarGrid = useCallback(() => {
    const days = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const totalDays: React.ReactNode[] = []

    // 填充空白格子
    for (let i = 0; i < firstDay; i++) {
      totalDays.push(
        <CalendarDay key={`empty-${i}`} isEmpty />
      )
    }

    // 填充日期格子
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = value?.getDate() === day
      
      totalDays.push(
        <CalendarDay 
          key={`day-${day}`}
          date={date}
          isSelected={isSelected}
          onClick={() => onDateSelect(date)}
        />
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
