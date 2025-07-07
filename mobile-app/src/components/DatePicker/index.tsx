import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getAvailableDates } from '../../services/appointment';
import './index.scss';

export interface DatePickerProps {
  /**
   * 服务/产品ID，用于获取可用日期
   */
  productId: number;
  /**
   * 当前选中日期
   */
  value?: string;
  /**
   * 日期变化回调
   */
  onChange?: (date: string) => void;
  /**
   * 时间段变化回调
   */
  onTimeSlotChange?: (timeSlot: TimeSlot) => void;
  /**
   * 最多可展示的月份数量
   */
  monthsToShow?: number;
  /**
   * 禁用的日期
   */
  disabledDates?: string[];
}

export interface DateInfo {
  date: string; // 格式：YYYY-MM-DD
  available: boolean;
  fullBooked: boolean;
  price?: number;
  weekday: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string; // 格式：HH:MM
  endTime: string; // 格式：HH:MM
  available: boolean;
  price?: number;
}

const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];

const DatePicker: React.FC<DatePickerProps> = ({
  productId,
  value,
  onChange,
  onTimeSlotChange,
  monthsToShow = 3,
  disabledDates = []
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateList, setDateList] = useState<DateInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(value || null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  // 生成日历数据
  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        // 调用API获取可用日期和时间段
        const res = await getAvailableDates(productId);
        setDateList(res.data);
        setLoading(false);
      } catch (err) {
        setError('获取可用日期失败，请稍后重试');
        setLoading(false);
        Taro.showToast({
          title: '获取档期失败',
          icon: 'none'
        });
      }
    };

    fetchDates();
  }, [productId]);

  // 处理日期选择
  const handleDateSelect = (date: DateInfo) => {
    if (!date.available) {
      Taro.showToast({
        title: '该日期不可预约',
        icon: 'none'
      });
      return;
    }

    setSelectedDate(date.date);
    setSelectedTimeSlot(null);
    
    if (onChange) {
      onChange(date.date);
    }
  };

  // 处理时间段选择
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) {
      Taro.showToast({
        title: '该时间段不可预约',
        icon: 'none'
      });
      return;
    }

    setSelectedTimeSlot(timeSlot);
    
    if (onTimeSlotChange) {
      onTimeSlotChange(timeSlot);
    }
  };

  // 按月份分组日期
  const groupedByMonth = React.useMemo(() => {
    const groups: { [key: string]: DateInfo[] } = {};
    
    dateList.forEach(date => {
      const monthKey = date.date.substring(0, 7); // YYYY-MM
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(date);
    });
    
    return Object.entries(groups)
      .map(([month, dates]) => ({
        month,
        dates
      }))
      .slice(0, monthsToShow);
  }, [dateList, monthsToShow]);

  // 格式化月份显示
  const formatMonthTitle = (month: string) => {
    const [year, monthNum] = month.split('-');
    return `${year}年${parseInt(monthNum)}月`;
  };

  if (loading) {
    return (
      <View className="date-picker-loading">
        <Text>加载档期信息...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="date-picker-error">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View className="date-picker">
      {/* 日历部分 */}
      <View className="calendar-container">
        {groupedByMonth.map(({ month, dates }) => (
          <View key={month} className="month-block">
            <View className="month-title">
              <Text>{formatMonthTitle(month)}</Text>
            </View>
            
            {/* 星期标题行 */}
            <View className="weekday-row">
              {weekdayLabels.map(day => (
                <View key={day} className="weekday-label">
                  <Text>{day}</Text>
                </View>
              ))}
            </View>
            
            {/* 日期格子 */}
            <View className="date-grid">
              {dates.map(date => (
                <View 
                  key={date.date} 
                  className={`date-cell ${date.available ? 'available' : 'unavailable'} ${selectedDate === date.date ? 'selected' : ''} ${date.fullBooked ? 'full-booked' : ''}`}
                  onClick={() => handleDateSelect(date)}
                >
                  <Text className="date-number">{date.date.split('-')[2]}</Text>
                  {date.price && <Text className="date-price">¥{date.price}</Text>}
                  {date.fullBooked && <Text className="full-booked-mark">已约满</Text>}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* 时间段选择部分 */}
      {selectedDate && (
        <View className="time-slot-container">
          <View className="time-slot-title">
            <Text>请选择时间段</Text>
          </View>
          
          <ScrollView className="time-slot-list" scrollX>
            {dateList
              .find(date => date.date === selectedDate)
              ?.timeSlots.map(slot => (
                <View 
                  key={slot.id} 
                  className={`time-slot-item ${slot.available ? 'available' : 'unavailable'} ${selectedTimeSlot?.id === slot.id ? 'selected' : ''}`}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  <Text className="time-slot-text">{slot.startTime} - {slot.endTime}</Text>
                  {slot.price && <Text className="time-slot-price">¥{slot.price}</Text>}
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default DatePicker;
