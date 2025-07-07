import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

/**
 * 简易日历组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onDaySelect - 选择日期的回调函数
 * @param {Date} props.selectedDate - 已选择的日期
 */
const Calendar = ({ onDaySelect, selectedDate: propSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || null);
  
  // 生成当月的天数数组
  const generateDays = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // 前面的空白填充
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // 填充当月天数
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const days = generateDays(currentMonth.getFullYear(), currentMonth.getMonth());
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const handleDaySelect = (day) => {
    if (!day) return;
    
    setSelectedDate(day);
    if (onDaySelect) {
      onDaySelect(day);
    }
  };
  
  // 检查日期是否是今天
  const isToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  // 检查日期是否被选中
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };
  
  // 格式化为YYYY年MM月
  const formatYearMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
  };
  
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  
  return (
    <View className='calendar'>
      <View className='calendar-header'>
        <Text className='prev-month' onClick={handlePrevMonth}>{'<'}</Text>
        <Text className='current-month'>{formatYearMonth(currentMonth)}</Text>
        <Text className='next-month' onClick={handleNextMonth}>{'>'}</Text>
      </View>
      
      <View className='weekdays'>
        {weekdays.map((day, index) => (
          <Text key={index} className='weekday'>{day}</Text>
        ))}
      </View>
      
      <View className='days'>
        {days.map((day, index) => (
          <View 
            key={index} 
            className={`day-cell ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
            onClick={() => handleDaySelect(day)}
          >
            {day && <Text className='day-text'>{day.getDate()}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Calendar;
