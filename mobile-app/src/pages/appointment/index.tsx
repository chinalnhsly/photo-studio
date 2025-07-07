import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import { AtForm, AtInput, AtToast } from 'taro-ui';
import { DatePicker, TimeSlot } from '../../components/DatePicker';
import { createAppointment } from '../../services/appointment';
import { getProductDetail } from '../../services/product';
import './index.scss';

interface FormData {
  customerName: string;
  customerPhone: string;
  remark: string;
}

const AppointmentPage: React.FC = () => {
  const router = useRouter();
  const { productId } = router.params;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    remark: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 加载商品详情
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await getProductDetail(Number(productId));
        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        Taro.showToast({
          title: '获取商品信息失败',
          icon: 'none'
        });
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  // 处理表单输入变化
  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 表单验证
  const validateForm = () => {
    if (!selectedDate) {
      setError('请选择预约日期');
      return false;
    }
    
    if (!selectedTimeSlot) {
      setError('请选择预约时间段');
      return false;
    }
    
    if (!formData.customerName.trim()) {
      setError('请填写姓名');
      return false;
    }
    
    // 手机号码格式验证
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(formData.customerPhone)) {
      setError('请填写正确的手机号码');
      return false;
    }
    
    setError(null);
    return true;
  };

  // 提交预约
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const res = await createAppointment({
        productId: Number(productId),
        date: selectedDate,
        timeSlotId: selectedTimeSlot!.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        remark: formData.remark
      });
      
      setSubmitSuccess(true);
      
      // 延迟跳转到订单页面
      setTimeout(() => {
        Taro.navigateTo({
          url: `/pages/order/detail?orderId=${res.data.id}`
        });
      }, 1500);
      
    } catch (err) {
      Taro.showToast({
        title: '预约提交失败，请重试',
        icon: 'none'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="appointment-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="appointment-page">
      {/* 商品信息 */}
      <View className="product-info">
        <View className="product-image" style={{ backgroundImage: `url(${product.image})` }} />
        <View className="product-details">
          <Text className="product-name">{product.name}</Text>
          <Text className="product-price">¥{product.price}</Text>
        </View>
      </View>
      
      {/* 日期和时间选择 */}
      <View className="section-title">选择预约时间</View>
      <View className="date-time-section">
        <DatePicker 
          productId={Number(productId)}
          value={selectedDate}
          onChange={date => setSelectedDate(date)}
          onTimeSlotChange={timeSlot => setSelectedTimeSlot(timeSlot)}
        />
      </View>
      
      {/* 预约信息表单 */}
      <View className="section-title">填写预约信息</View>
      <AtForm>
        <AtInput
          name="customerName"
          title="姓名"
          type="text"
          placeholder="请输入您的姓名"
          value={formData.customerName}
          onChange={value => handleInputChange('customerName', value as string)}
        />
        <AtInput
          name="customerPhone"
          title="手机号码"
          type="phone"
          placeholder="请输入您的手机号码"
          value={formData.customerPhone}
          onChange={value => handleInputChange('customerPhone', value as string)}
        />
        <View className="textarea-container">
          <Text className="textarea-label">备注</Text>
          <Textarea
            className="remark-textarea"
            value={formData.remark}
            placeholder="请填写预约备注信息（可选）"
            onInput={e => handleInputChange('remark', e.detail.value)}
          />
        </View>
      </AtForm>
      
      {/* 错误提示 */}
      {error && (
        <View className="error-message">
          <Text>{error}</Text>
        </View>
      )}
      
      {/* 提交按钮 */}
      <View className="submit-section">
        <Button 
          className="submit-button" 
          loading={submitting}
          onClick={handleSubmit}
        >
          确认预约
        </Button>
      </View>
      
      {/* 提交成功提示 */}
      <AtToast 
        isOpened={submitSuccess} 
        text="预约成功，即将跳转" 
        status="success" 
        duration={1500} 
      />
    </View>
  );
};

export default AppointmentPage;
