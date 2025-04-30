import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon, AtRadio, AtToast } from 'taro-ui';
import { getOrderDetail, createPayment, checkPaymentStatus } from '../../../services/order';
import { formatPrice } from '../../../utils/format';
import './index.scss';

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.params;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');

  // 定时器ID，用于轮询支付状态
  const [pollingTimer, setPollingTimer] = useState<NodeJS.Timeout | null>(null);

  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        const res = await getOrderDetail(orderId);
        
        // 如果订单已支付，直接跳转到订单详情页
        if (res.data.status !== 'pending') {
          Taro.showToast({
            title: '订单已支付',
            icon: 'success'
          });
          
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/order/detail/index?id=${orderId}`
            });
          }, 1500);
          return;
        }
        
        setOrder(res.data);
      } catch (error) {
        Taro.showToast({
          title: '获取订单信息失败',
          icon: 'none'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
    
    // 组件卸载时清除定时器
    return () => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
      }
    };
  }, [orderId]);

  // 处理支付方式选择
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  // 显示提示信息
  const showToast = (text: string) => {
    setToastText(text);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2000);
  };

  // 处理支付请求
  const handlePayment = async () => {
    if (!order || submitting) return;
    
    try {
      setSubmitting(true);
      
      // 创建支付订单
      const paymentRes = await createPayment({
        orderId: order.id,
        paymentMethod
      });
      
      // 如果是微信支付，调用微信支付接口
      if (paymentMethod === 'wechat') {
        // 小程序环境下的支付处理
        Taro.requestPayment({
          ...paymentRes.data.paymentParams,
          success: () => {
            // 支付成功后，开始轮询支付状态
            pollPaymentStatus();
          },
          fail: (err) => {
            console.log('支付失败', err);
            showToast('支付已取消');
            setSubmitting(false);
          }
        });
      }
    } catch (error) {
      console.error('创建支付订单失败', error);
      showToast('创建支付订单失败，请重试');
      setSubmitting(false);
    }
  };

  // 轮询支付状态
  const pollPaymentStatus = () => {
    // 每3秒查询一次支付状态
    const timer = setInterval(async () => {
      try {
        const statusRes = await checkPaymentStatus(order.id);
        
        // 如果支付成功
        if (statusRes.data.paid) {
          clearInterval(timer);
          setPaymentSuccess(true);
          
          // 延迟跳转
          setTimeout(() => {
            Taro.redirectTo({
              url: `/pages/order/detail/index?id=${order.id}`
            });
          }, 2000);
        }
      } catch (error) {
        console.error('查询支付状态失败', error);
      }
    }, 3000);
    
    // 保存定时器ID，以便在组件卸载时清除
    setPollingTimer(timer);
    
    // 最多轮询30秒
    setTimeout(() => {
      clearInterval(timer);
      
      // 如果30秒后还没支付成功，提示用户
      if (!paymentSuccess) {
        showToast('支付状态查询超时，请在订单页面查看');
        setSubmitting(false);
      }
    }, 30000);
  };

  if (loading) {
    return (
      <View className="payment-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="payment-error">
        <Text>订单不存在或已删除</Text>
        <Button 
          className="back-button"
          onClick={() => Taro.navigateBack()}
        >
          返回订单列表
        </Button>
      </View>
    );
  }

  return (
    <View className="payment-page">
      {/* 订单信息 */}
      <View className="order-info-section">
        <View className="order-title">
          <AtIcon value="money" size="20" color="#333" />
          <Text>订单支付</Text>
        </View>
        
        <View className="order-price">
          <Text className="currency">¥</Text>
          <Text className="amount">{formatPrice(order.totalAmount)}</Text>
        </View>
        
        <View className="order-detail">
          <Text className="label">订单编号</Text>
          <Text className="value">{order.orderNumber}</Text>
        </View>
      </View>
      
      {/* 支付方式选择 */}
      <View className="payment-method-section">
        <View className="section-title">支付方式</View>
        
        <AtRadio
          options={[
            { label: '微信支付', value: 'wechat', desc: '推荐使用微信支付' },
            { label: '余额支付', value: 'balance', desc: '当前余额：¥0.00', disabled: true }
          ]}
          value={paymentMethod}
          onClick={handlePaymentMethodChange}
        />
      </View>
      
      {/* 商品信息 */}
      <View className="product-section">
        <View className="section-title">商品信息</View>
        
        <View className="product-card">
          <Image 
            className="product-image" 
            src={order.productImage}
            mode="aspectFill"
          />
          
          <View className="product-info">
            <Text className="product-name">{order.productName}</Text>
            <View className="price-row">
              <Text className="price">¥{formatPrice(order.price)}</Text>
              <Text className="quantity">x{order.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* 支付按钮 */}
      <View className="payment-action">
        <Button 
          className="payment-button"
          loading={submitting}
          disabled={submitting || paymentSuccess}
          onClick={handlePayment}
        >
          {submitting ? '支付处理中...' : '确认支付'}
        </Button>
        
        <Text className="payment-tip">请在 30分钟 内完成支付，否则订单将自动取消</Text>
      </View>
      
      {/* 支付成功提示 */}
      <AtToast
        isOpened={paymentSuccess}
        text="支付成功，正在跳转..."
        status="success"
        duration={0}
      />
      
      {/* 普通提示 */}
      <AtToast
        isOpened={toastOpen}
        text={toastText}
        status="error"
      />
    </View>
  );
};

export default PaymentPage;
