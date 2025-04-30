import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtSteps, AtCalendar, AtButton, AtIcon, AtToast } from 'taro-ui';
import { getProductDetail } from '../../services/product';
import { getAvailableSlots, createBooking } from '../../services/booking';
import './index.scss';

const BookingPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.params;
  
  const [current, setCurrent] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastInfo, setToastInfo] = useState({ isOpened: false, text: '', status: '' });
  
  // 步骤定义
  const steps = [
    { title: '选择日期', desc: '选择拍摄日期' },
    { title: '选择时间', desc: '选择预约时段' },
    { title: '确认预约', desc: '确认预约信息' }
  ];
  
  // 初始化
  useEffect(() => {
    if (!productId) {
      Taro.showToast({
        title: '缺少商品信息',
        icon: 'none'
      });
      return;
    }
    
    fetchProductDetail();
  }, [productId]);
  
  // 获取商品详情
  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await getProductDetail(Number(productId));
      setProduct(response.data);
    } catch (error) {
      console.error('获取商品详情失败:', error);
      showToast('获取商品详情失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 显示消息提示
  const showToast = (text: string, status: 'success' | 'error' | 'loading' = 'success') => {
    setToastInfo({
      isOpened: true,
      text,
      status
    });
    
    setTimeout(() => {
      setToastInfo({ ...toastInfo, isOpened: false });
    }, 2000);
  };
  
  // 日期选择
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
      const response = await getAvailableSlots({
        date,
        productId: Number(productId)
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('获取可用时间段失败:', error);
      showToast('获取可用时间段失败', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // 时间段选择
  const handleTimeSelect = (slot: any) => {
    setSelectedTime(slot.id);
    
    // 进入下一步
    setCurrent(2);
  };
  
  // 提交预约
  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTime) {
      showToast('请选择预约日期和时间', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const bookingData = {
        productId: Number(productId),
        slotId: selectedTime,
        notes: ''
      };
      
      const response = await createBooking(bookingData);
      
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
    return `${startTime} - ${endTime}`;
  };
  
  return (
    <View className="booking-page">
      <View className="header">
        <View className="back-icon" onClick={goBack}>
          <AtIcon value="chevron-left" size="20" color="#333" />
        </View>
        <Text className="title">预约拍摄</Text>
      </View>
      
      {/* 步骤条 */}
      <AtSteps
        items={steps}
        current={current}
        onChange={setCurrent}
      />
      
      {/* 商品信息卡片 */}
      {product && (
        <View className="product-card">
          <Image className="product-image" src={product.image} mode="aspectFill" />
          <View className="product-info">
            <Text className="product-name">{product.name}</Text>
            <Text className="product-price">¥{product.price.toFixed(2)}</Text>
          </View>
        </View>
      )}
      
      {/* 预约步骤内容 */}
      <View className="booking-content">
        {/* 步骤1: 选择日期 */}
        {current === 0 && (
          <View className="date-selection">
            <Text className="section-title">选择拍摄日期</Text>
            <AtCalendar
              currentDate={new Date().toISOString().slice(0, 10)}
              minDate={new Date().toISOString().slice(0, 10)}
              maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
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
              <View className="loading-slots">加载中...</View>
            ) : availableSlots.length === 0 ? (
              <View className="empty-slots">
                <Text>当日没有可预约的时间段</Text>
                <AtButton type="secondary" size="small" onClick={() => setCurrent(0)}>
                  返回选择其他日期
                </AtButton>
              </View>
            ) : (
              <View className="time-slots">
                {availableSlots.map(slot => (
                  <View
                    key={slot.id}
                    className={`time-slot ${selectedTime === slot.id ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    <Text>{formatTimeSlot(slot.startTime, slot.endTime)}</Text>
                    {slot.photographer && (
                      <Text className="photographer">摄影师: {slot.photographer.name}</Text>
                    )}
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
                <Text className="info-label">拍摄日期:</Text>
                <Text className="info-value">{selectedDate}</Text>
              </View>
              
              <View className="info-item">
                <Text className="info-label">拍摄时间:</Text>
                <Text className="info-value">
                  {availableSlots.find(slot => slot.id === selectedTime)
                    ? formatTimeSlot(
                        availableSlots.find(slot => slot.id === selectedTime).startTime,
                        availableSlots.find(slot => slot.id === selectedTime).endTime
                      )
                    : ''}
                </Text>
              </View>
              
              {availableSlots.find(slot => slot.id === selectedTime)?.photographer && (
                <View className="info-item">
                  <Text className="info-label">摄影师:</Text>
                  <Text className="info-value">
                    {availableSlots.find(slot => slot.id === selectedTime).photographer.name}
                  </Text>
                </View>
              )}
              
              <View className="info-item">
                <Text className="info-label">套餐:</Text>
                <Text className="info-value">{product.name}</Text>
              </View>
              
              <View className="info-item">
                <Text className="info-label">价格:</Text>
                <Text className="info-value info-price">¥{product.price.toFixed(2)}</Text>
              </View>
            </View>
            
            <View className="booking-notice">
              <Text className="notice-title">预约须知:</Text>
              <Text className="notice-content">
                1. 请提前10分钟到店，准备拍摄
                2. 拍摄当天如需取消，将收取50%的违约金
                3. 拍摄结束后，照片将在7个工作日内处理完成
              </Text>
            </View>
            
            <AtButton
              type="primary"
              className="submit-button"
              onClick={handleSubmitBooking}
              loading={submitting}
            >
              确认预约
            </AtButton>
          </View>
        )}
      </View>
      
      <AtToast 
        isOpened={toastInfo.isOpened} 
        text={toastInfo.text} 
        status={toastInfo.status} 
      />
    </View>
  );
};

export default BookingPage;
