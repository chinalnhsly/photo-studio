import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon, AtSteps } from 'taro-ui';
import { getOrderDetail } from '../../../services/order';
import './index.scss';

const OrderSuccess: React.FC = () => {
  const router = useRouter();
  const { orderId, status = 'created' } = router.params;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const res = await getOrderDetail(orderId);
        setOrder(res.data);
      } catch (error) {
        console.error('获取订单详情失败:', error);
        Taro.showToast({
          title: '获取订单详情失败',
          icon: 'none'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetail();
  }, [orderId]);
  
  // 跳转到订单详情
  const goToOrderDetail = () => {
    Taro.navigateTo({
      url: `/pages/order/detail/index?id=${orderId}`
    });
  };
  
  // 返回首页
  const goToHome = () => {
    Taro.switchTab({
      url: '/pages/home/index'
    });
  };
  
  // 去评价
  const goToReview = () => {
    Taro.navigateTo({
      url: `/pages/order/review/index?orderId=${orderId}`
    });
  };

  // 确定步骤状态
  const getStepStatus = (currentStatus) => {
    const statusMap = {
      'created': 0,
      'paid': 1,
      'completed': 2
    };
    
    return statusMap[currentStatus] || 0;
  };
  
  // 步骤项配置
  const steps = [
    { title: '下单成功', desc: '等待支付' },
    { title: '支付完成', desc: '等待拍摄' },
    { title: '服务完成', desc: '拍摄结束' }
  ];
  
  if (loading) {
    return (
      <View className="order-success-loading">
        <Text>加载中...</Text>
      </View>
    );
  }
  
  return (
    <View className="order-success-page">
      {/* 顶部状态 */}
      <View className="success-header">
        <Image 
          className="success-icon"
          src="/assets/images/success-icon.png"
        />
        
        <Text className="success-title">
          {status === 'created' ? '下单成功' : 
           status === 'paid' ? '支付成功' : '服务完成'}
        </Text>
        
        <Text className="success-desc">
          {status === 'created' ? '请在24小时内完成支付' : 
           status === 'paid' ? '请按预约时间到店拍摄' : '期待您的评价反馈'}
        </Text>
      </View>
      
      {/* 步骤条 */}
      <View className="steps-container">
        <AtSteps
          items={steps}
          current={getStepStatus(status)}
          onChange={() => {}}
        />
      </View>
      
      {/* 订单信息卡片 */}
      <View className="order-info-card">
        <View className="card-header">
          <Text className="card-title">订单信息</Text>
        </View>
        
        <View className="info-item">
          <Text className="info-label">订单编号</Text>
          <Text className="info-value">{order?.orderNumber}</Text>
        </View>
        
        <View className="info-item">
          <Text className="info-label">支付金额</Text>
          <Text className="info-value price">¥{order?.totalAmount?.toFixed(2)}</Text>
        </View>
        
        <View className="info-item">
          <Text className="info-label">支付方式</Text>
          <Text className="info-value">{order?.paymentMethod || '未支付'}</Text>
        </View>
        
        {status === 'paid' && (
          <View className="info-item">
            <Text className="info-label">预约时间</Text>
            <Text className="info-value">{order?.appointmentTime || '未预约'}</Text>
          </View>
        )}
      </View>
      
      {/* 底部操作区 */}
      <View className="bottom-actions">
        {status === 'created' && (
          <>
            <Button className="action-button secondary" onClick={goToOrderDetail}>
              查看订单
            </Button>
            <Button className="action-button primary" onClick={() => {
              Taro.navigateTo({
                url: `/pages/order/payment/index?orderId=${orderId}`
              });
            }}>
              去支付
            </Button>
          </>
        )}
        
        {status === 'paid' && (
          <>
            <Button className="action-button secondary" onClick={goToHome}>
              返回首页
            </Button>
            <Button className="action-button primary" onClick={goToOrderDetail}>
              查看订单
            </Button>
          </>
        )}
        
        {status === 'completed' && (
          <>
            <Button className="action-button secondary" onClick={goToHome}>
              返回首页
            </Button>
            <Button className="action-button primary" onClick={goToReview}>
              去评价
            </Button>
          </>
        )}
      </View>
    </View>
  );
};

export default OrderSuccess;
