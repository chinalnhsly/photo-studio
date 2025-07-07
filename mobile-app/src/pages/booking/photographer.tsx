import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import { AtCalendar, AtSteps, AtIcon, AtTextarea, AtToast } from 'taro-ui';
import { getPhotographerDetail, getPhotographerAvailability, bookPhotographer } from '../../services/photographer';
import './photographer.scss';

const BookPhotographer: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [photographer, setPhotographer] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [customerNote, setCustomerNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastConfig, setToastConfig] = useState({ isOpened: false, text: '', status: '' });
  
  // 步骤定义
  const steps = [
    { title: '选择日期', desc: '选择拍摄日期' },
    { title: '选择时间', desc: '选择拍摄时段' },
    { title: '确认预约', desc: '确认预约信息' }
  ];
  
  useEffect(() => {
    if (!id) {
      Taro.showToast({
        title: '缺少摄影师信息',
        icon: 'none'
      });
      return;
    }
    
    fetchPhotographerDetail();
  }, [id]);
  
  // 获取摄影师详情
  const fetchPhotographerDetail = async () => {
    try {
      setLoading(true);
      const response = await getPhotographerDetail(Number(id));
      setPhotographer(response.data);
    } catch (error) {
      console.error('获取摄影师详情失败:', error);
      showToast('获取摄影师详情失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 显示提示
  const showToast = (text: string, status: 'success' | 'error' | 'loading' = 'success') => {
    setToastConfig({
      isOpened: true,
      text,
      status
    });
    
    setTimeout(() => {
      setToastConfig({ ...toastConfig, isOpened: false });
    }, 2000);
  };
  
  // 处理日期选择
  const handleDateSelect = (date: any) => {
    const selectedDate = date.value.start;
    setSelectedDate(selectedDate);
    
    // 获取可用时间段
    fetchAvailableSlots(selectedDate);
    
    // 进入下一步
    setCurrent(1);
  };
  
  // 获取可用时间段
  const fetchAvailableSlots = async (date: string) => {
    try {
      setLoading(true);
      const response = await getPhotographerAvailability(
        Number(id),
        date,
        date
      );
      
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('获取可用时间段失败:', error);
      showToast('获取可用时间段失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理时间段选择
  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot);
    
    // 进入下一步
    setCurrent(2);
  };
  
  // 提交预约
  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      showToast('请选择预约日期和时间', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const bookingData = {
        photographerId: Number(id),
        slotId: selectedSlot.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        customerNotes: customerNote
      };
      
      const response = await bookPhotographer(bookingData);
      
      // 跳转到成功页面
      Taro.redirectTo({
        url: `/pages/booking/success?bookingId=${response.data.id}`
      });
    } catch (error) {
      console.error('创建预约失败:', error);
      showToast('创建预约失败', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 返回上一步
  const goBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
    } else {
      Taro.navigateBack();
    }
  };
  
  // 格式化时间
  const formatTimeSlot = (startTime: string, endTime: string) => {
    return `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`;
  };
  
  if (loading && !photographer) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className="booking-photographer-page">
      {/* 顶部导航 */}
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">预约摄影师</Text>
      </View>
      
      {/* 步骤条 */}
      <AtSteps
        items={steps}
        current={current}
        onChange={setCurrent}
      />
      
      {/* 摄影师信息卡片 */}
      <View className="photographer-card">
        <Image className="photographer-avatar" src={photographer.avatar} mode="aspectFill" />
        <View className="photographer-info">
          <Text className="photographer-name">{photographer.name}</Text>
          <View className="rating-row">
            <View className="stars">
              {Array(5).fill(0).map((_, i) => (
                <Text 
                  key={i} 
                  className={`star ${i < Math.floor(photographer.rating) ? 'filled' : ''}`}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text className="rating-value">{photographer.rating.toFixed(1)}</Text>
          </View>
          <View className="specialties">
            {photographer.specialties?.slice(0, 2).map((specialty, index) => (
              <Text key={index} className="specialty-tag">
                {specialty.name}
              </Text>
            ))}
          </View>
        </View>
      </View>
      
      {/* 预约步骤内容 */}
      <View className="booking-content">
        {/* 步骤1: 选择日期 */}
        {current === 0 && (
          <View className="date-selection">
            <Text className="section-title">选择拍摄日期</Text>
            <AtCalendar
              currentDate={new Date().toISOString().slice(0, 10)}
              minDate={new Date().toISOString().slice(0, 10)}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
              onSelectDate={handleDateSelect}
            />
          </View>
        )}
        
        {/* 步骤2: 选择时间 */}
        {current === 1 && (
          <View className="time-selection">
            <Text className="section-title">选择拍摄时间段</Text>
            <Text className="selected-date">{selectedDate}</Text>
            
            {loading ? (
              <View className="loading-slots">加载可用时间中...</View>
            ) : availableSlots.length === 0 ? (
              <View className="empty-slots">
                <Text>当日没有可预约的时间段</Text>
                <Button className="back-button" onClick={() => setCurrent(0)}>
                  返回选择其他日期
                </Button>
              </View>
            ) : (
              <View className="time-slots">
                {availableSlots.map(slot => (
                  <View
                    key={slot.id}
                    className={`time-slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => handleSlotSelect(slot)}
                  >
                    <Text className="time-text">{formatTimeSlot(slot.startTime, slot.endTime)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* 步骤3: 确认预约 */}
        {current === 2 && (
          <View className="booking-confirmation">
            <Text className="section-title">确认预约信息</Text>
            
            <View className="confirmation-info">
              <View className="info-item">
                <Text className="info-label">摄影师</Text>
                <Text className="info-value">{photographer.name}</Text>
              </View>
              
              <View className="info-item">
                <Text className="info-label">拍摄日期</Text>
                <Text className="info-value">{selectedDate}</Text>
              </View>
              
              <View className="info-item">
                <Text className="info-label">拍摄时间</Text>
                <Text className="info-value">
                  {selectedSlot ? formatTimeSlot(selectedSlot.startTime, selectedSlot.endTime) : ''}
                </Text>
              </View>
              
              <View className="info-item note-item">
                <Text className="info-label">备注信息</Text>
                <AtTextarea
                  value={customerNote}
                  onChange={value => setCustomerNote(value)}
                  maxLength={200}
                  placeholder="请输入拍摄需求或其他须知"
                  height={120}
                  className="note-textarea"
                />
              </View>
            </View>
            
            <View className="booking-notice">
              <Text className="notice-title">预约须知</Text>
              <Text className="notice-text">
                1. 请在预约时间前15分钟到达拍摄地点
                2. 如需修改预约，请提前24小时联系客服
                3. 拍摄结束后，照片将在7个工作日内处理完成
              </Text>
            </View>
            
            <Button
              className="submit-button"
              onClick={handleSubmitBooking}
              loading={submitting}
            >
              确认预约
            </Button>
          </View>
        )}
      </View>
      
      <AtToast
        isOpened={toastConfig.isOpened}
        text={toastConfig.text}
        status={toastConfig.status as any}
      />
    </View>
  );
};

export default BookPhotographer;
