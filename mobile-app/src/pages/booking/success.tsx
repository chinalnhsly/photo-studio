import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { getBookingDetail } from '../../services/booking';
import './success.scss';

const BookingSuccess: React.FC = () => {
  const router = useRouter();
  const { bookingId } = router.params;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 获取预约详情
  useEffect(() => {
    if (!bookingId) {
      return;
    }
    
    fetchBookingDetail();
  }, [bookingId]);
  
  // 获取预约详情
  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await getBookingDetail(Number(bookingId));
      setBooking(response.data);
    } catch (error) {
      console.error('获取预约详情失败:', error);
      Taro.showToast({
        title: '获取预约详情失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 查看预约详情
  const viewBookingDetail = () => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${bookingId}`
    });
  };
  
  // 返回首页
  const goToHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    });
  };
  
  // 添加日历提醒
  const addCalendarReminder = () => {
    if (!booking) return;
    
    // 微信小程序中可能需要使用特定 API，这里仅作示例
    Taro.showToast({
      title: '已添加至日历提醒',
      icon: 'success'
    });
  };
  
  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  // 格式化时间
  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5); // 只取小时和分钟，去掉秒
  };
  
  if (loading) {
    return (
      <View className="booking-success-loading">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  if (!booking) {
    return (
      <View className="booking-success-error">
        <Text>未找到预约信息</Text>
        <Button onClick={goToHome} className="back-home-btn">返回首页</Button>
      </View>
    );
  }
  
  return (
    <View className="booking-success-page">
      <View className="success-icon-container">
        <View className="success-icon">
          <AtIcon value="check" size="32" color="#fff" />
        </View>
      </View>
      
      <Text className="success-title">预约成功</Text>
      <Text className="success-desc">您的摄影预约已成功提交</Text>
      
      <View className="booking-info-card">
        <View className="booking-header">
          <Text className="booking-number">预约号: {booking.bookingNumber}</Text>
        </View>
        
        <View className="info-divider"></View>
        
        <View className="booking-detail">
          <View className="booking-item">
            <View className="item-icon">
              <AtIcon value="calendar" size="20" color="#1890ff" />
            </View>
            <View className="item-content">
              <Text className="item-label">拍摄日期</Text>
              <Text className="item-value">{formatDate(booking.bookingDate)}</Text>
            </View>
          </View>
          
          <View className="booking-item">
            <View className="item-icon">
              <AtIcon value="clock" size="20" color="#1890ff" />
            </View>
            <View className="item-content">
              <Text className="item-label">拍摄时间</Text>
              <Text className="item-value">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Text>
            </View>
          </View>
          
          <View className="booking-item">
            <View className="item-icon">
              <AtIcon value="map-pin" size="20" color="#1890ff" />
            </View>
            <View className="item-content">
              <Text className="item-label">拍摄地点</Text>
              <Text className="item-value">{booking.location || '影楼总店'}</Text>
            </View>
          </View>
          
          {booking.photographer && (
            <View className="booking-item">
              <View className="item-icon">
                <AtIcon value="user" size="20" color="#1890ff" />
              </View>
              <View className="item-content">
                <Text className="item-label">摄影师</Text>
                <Text className="item-value">{booking.photographer.name}</Text>
              </View>
            </View>
          )}
          
          <View className="booking-item">
            <View className="item-icon">
              <AtIcon value="camera" size="20" color="#1890ff" />
            </View>
            <View className="item-content">
              <Text className="item-label">套餐名称</Text>
              <Text className="item-value">{booking.product.name}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View className="action-buttons">
        <Button className="action-button primary" onClick={viewBookingDetail}>
          查看预约详情
        </Button>
        
        <Button className="action-button secondary" onClick={addCalendarReminder}>
          <AtIcon value="calendar" size="16" color="#1890ff" />
          添加日历提醒
        </Button>
        
        <Button className="action-button outline" onClick={goToHome}>
          返回首页
        </Button>
      </View>
      
      <View className="service-notice">
        <Text className="notice-title">温馨提示</Text>
        <Text className="notice-text">
          1. 请在预约时间前15分钟到达拍摄地点
          2. 如需修改预约，请提前24小时联系客服
          3. 摄影师将在拍摄前联系您确认详情
        </Text>
      </View>
    </View>
  );
};

export default BookingSuccess;
