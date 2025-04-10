import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { mockApi } from '../../services/mock'
import './index.scss'

// 模拟订单数据
const mockOrder = {
  id: 'order_123456',
  productId: '1',
  productName: '高级婚纱摄影套餐',
  productImage: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
  price: 3999,
  originalPrice: 5999,
  bookingInfo: {
    date: '2023-07-20',
    timeSlot: '上午 09:00-12:00',
    contact: '张先生',
    phone: '138****6666'
  },
  discounts: [
    {
      type: 'coupon',
      name: '新用户优惠券',
      amount: 200
    },
    {
      type: 'member',
      name: '会员折扣',
      amount: 100
    }
  ],
  totalAmount: 3699
}

export default function PaymentPage() {
  const router = useRouter()
  const { orderId } = router.params
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [paying, setPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('wechat') // wechat, alipay
  
  useEffect(() => {
    // 模拟加载订单数据
    const fetchOrder = () => {
      setLoading(true)
      // 模拟接口请求延迟
      setTimeout(() => {
        setOrder(mockOrder)
        setLoading(false)
      }, 500)
    }
    
    fetchOrder()
  }, [orderId])
  
  // 处理支付
  const handlePayment = () => {
    if (paying) return
    
    setPaying(true)
    
    // 模拟支付请求
    setTimeout(() => {
      // 实际开发中，这里应当调用微信支付API
      Taro.showLoading({ title: '处理支付...' })
      
      setTimeout(() => {
        Taro.hideLoading()
        
        // 模拟支付成功
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
        
        // 跳转到支付成功页
        setTimeout(() => {
          Taro.redirectTo({
            url: `/pages/payment/success?orderId=${order.id}`
          })
        }, 1500)
      }, 2000)
    }, 500)
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  if (!order) {
    return (
      <View className='error-container'>
        <Text>订单信息不存在</Text>
        <Button className='back-btn' onClick={() => Taro.navigateBack()}>返回上一页</Button>
      </View>
    )
  }

  return (
    <View className='payment-page'>
      {/* 订单信息 */}
      <View className='order-card'>
        <View className='card-header'>
          <Text className='card-title'>订单信息</Text>
          <Text className='order-number'>订单号：{order.id}</Text>
        </View>
        
        <View className='product-info'>
          <Image className='product-image' src={order.productImage} mode='aspectFill' />
          <View className='product-content'>
            <Text className='product-name'>{order.productName}</Text>
            <View className='product-price'>
              <Text className='price'>¥{order.price}</Text>
              {order.originalPrice > order.price && (
                <Text className='original-price'>¥{order.originalPrice}</Text>
              )}
            </View>
          </View>
        </View>
        
        <View className='booking-info'>
          <View className='info-row'>
            <Text className='info-label'>预约日期</Text>
            <Text className='info-value'>{order.bookingInfo.date}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>预约时段</Text>
            <Text className='info-value'>{order.bookingInfo.timeSlot}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>联系人</Text>
            <Text className='info-value'>{order.bookingInfo.contact}</Text>
          </View>
          <View className='info-row'>
            <Text className='info-label'>联系电话</Text>
            <Text className='info-value'>{order.bookingInfo.phone}</Text>
          </View>
        </View>
      </View>
      
      {/* 支付金额 */}
      <View className='payment-card'>
        <View className='card-header'>
          <Text className='card-title'>支付金额</Text>
        </View>
        
        <View className='price-detail'>
          <View className='price-row'>
            <Text className='label'>商品金额</Text>
            <Text className='value'>¥{order.price}</Text>
          </View>
          
          {order.discounts && order.discounts.map((discount, index) => (
            <View key={index} className='price-row discount'>
              <Text className='label'>{discount.name}</Text>
              <Text className='value'>-¥{discount.amount}</Text>
            </View>
          ))}
          
          <View className='price-row total'>
            <Text className='label'>实付金额</Text>
            <Text className='value'>¥{order.totalAmount}</Text>
          </View>
        </View>
      </View>
      
      {/* 支付方式 */}
      <View className='payment-method-card'>
        <View className='card-header'>
          <Text className='card-title'>支付方式</Text>
        </View>
        
        <View className='method-list'>
          <View 
            className={`method-item ${paymentMethod === 'wechat' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('wechat')}
          >
            <View className='method-icon wechat'>
              <View className='icon-box'>微信</View>
            </View>
            <Text className='method-name'>微信支付</Text>
            {paymentMethod === 'wechat' && (
              <View className='checked-icon'>✓</View>
            )}
          </View>
          
          <View 
            className={`method-item ${paymentMethod === 'alipay' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('alipay')}
          >
            <View className='method-icon alipay'>
              <View className='icon-box'>支付宝</View>
            </View>
            <Text className='method-name'>支付宝支付</Text>
            {paymentMethod === 'alipay' && (
              <View className='checked-icon'>✓</View>
            )}
          </View>
        </View>
      </View>
      
      {/* 支付按钮 */}
      <View className='payment-action'>
        <View className='total-amount'>
          <Text className='label'>合计：</Text>
          <Text className='amount'>¥{order.totalAmount}</Text>
        </View>
        
        <Button 
          className='pay-btn' 
          loading={paying}
          onClick={handlePayment}
        >
          立即支付
        </Button>
      </View>
    </View>
  )
}
