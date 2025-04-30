import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

const PaymentPage = () => {
  const router = useRouter()
  const { orderId } = router.params
  
  const [orderInfo, setOrderInfo] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('wechat')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // 获取订单信息
  useEffect(() => {
    const fetchOrderInfo = async () => {
      setLoading(true)
      
      // 模拟API请求
      setTimeout(() => {
        // 模拟订单数据
        const mockOrderInfo = {
          id: orderId || 'BO' + Date.now().toString().slice(-10),
          serviceName: '婚纱照套餐',
          serviceImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
          date: '2023-10-15',
          time: '14:00-16:00',
          price: 2999,
          originalPrice: 3999,
          discount: 1000,
          status: 'pending',
          contactName: '张先生',
          contactPhone: '138****1234',
          peopleCount: '2人'
        }
        
        setOrderInfo(mockOrderInfo)
        setLoading(false)
      }, 600)
    }
    
    fetchOrderInfo()
  }, [orderId])
  
  // 处理支付方式变化
  const handlePaymentChange = (value) => {
    setSelectedPayment(value)
  }
  
  // 处理支付
  const handlePay = async () => {
    try {
      setSubmitting(true)
      
      // 模拟支付过程
      Taro.showLoading({
        title: '支付处理中...'
      })
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      Taro.hideLoading()
      
      // 跳转到支付成功页面
      Taro.redirectTo({
        url: `/pages/payment/success?orderId=${orderInfo.id}&amount=${orderInfo.price}`
      })
      
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: '支付失败，请重试',
        icon: 'none'
      })
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  if (!orderInfo) {
    return (
      <View className='error-container'>
        <Text>订单信息不存在</Text>
        <Button className='back-btn' onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    )
  }
  
  return (
    <View className='payment-page'>
      <View className='order-card'>
        <View className='card-header'>
          <Text className='card-title'>订单信息</Text>
          <Text className='order-number'>订单号：{orderInfo.id}</Text>
        </View>
        
        <View className='product-info'>
          <Image className='product-image' src={orderInfo.serviceImage} mode='aspectFill' />
          <View className='product-content'>
            <Text className='product-name'>{orderInfo.serviceName}</Text>
            <View className='product-price-row'>
              <Text className='price'>¥{orderInfo.price}</Text>
              {orderInfo.originalPrice > orderInfo.price && (
                <Text className='original-price'>¥{orderInfo.originalPrice}</Text>
              )}
            </View>
          </View>
        </View>
        
        <View className='booking-info'>
          <View className='info-row'>
            <Text className='info-label'>预约日期</Text>
            <Text className='info-value'>{orderInfo.date}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>预约时间</Text>
            <Text className='info-value'>{orderInfo.time}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>联系人</Text>
            <Text className='info-value'>{orderInfo.contactName}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>联系电话</Text>
            <Text className='info-value'>{orderInfo.contactPhone}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>拍摄人数</Text>
            <Text className='info-value'>{orderInfo.peopleCount}</Text>
          </View>
        </View>
      </View>
      
      <View className='payment-card'>
        <View className='card-header'>
          <Text className='card-title'>费用明细</Text>
        </View>
        
        <View className='price-detail'>
          <View className='price-row'>
            <Text className='label'>服务原价</Text>
            <Text className='value'>¥{orderInfo.originalPrice}</Text>
          </View>
          {orderInfo.discount > 0 && (
            <View className='price-row discount'>
              <Text className='label'>优惠金额</Text>
              <Text className='value'>-¥{orderInfo.discount}</Text>
            </View>
          )}
          <View className='price-row total'>
            <Text className='label'>应付金额</Text>
            <Text className='value'>¥{orderInfo.price}</Text>
          </View>
        </View>
      </View>
      
      <View className='payment-method-card'>
        <View className='card-header'>
          <Text className='card-title'>支付方式</Text>
        </View>
        
        <View className='method-list'>
          <View 
            className='method-item' 
            onClick={() => handlePaymentChange('wechat')}
          >
            <View className='method-icon wechat'>
              <Text className='icon-box'>微</Text>
            </View>
            <Text className='method-name'>微信支付</Text>
            {selectedPayment === 'wechat' && (
              <View className='checked-icon'>✓</View>
            )}
          </View>
          
          <View 
            className='method-item' 
            onClick={() => handlePaymentChange('alipay')}
          >
            <View className='method-icon alipay'>
              <Text className='icon-box'>支</Text>
            </View>
            <Text className='method-name'>支付宝支付</Text>
            {selectedPayment === 'alipay' && (
              <View className='checked-icon'>✓</View>
            )}
          </View>
        </View>
      </View>
      
      <View className='payment-action'>
        <View className='total-amount'>
          <Text className='label'>实付金额：</Text>
          <Text className='amount'>¥{orderInfo.price}</Text>
        </View>
        <Button 
          className='pay-btn' 
          loading={submitting}
          onClick={handlePay}
        >
          立即支付
        </Button>
      </View>
    </View>
  )
}

export default PaymentPage
