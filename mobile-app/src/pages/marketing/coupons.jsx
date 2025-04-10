import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './coupons.scss'

// 模拟优惠券数据
const mockCoupons = [
  {
    id: '1',
    title: '新用户专享券',
    type: 'discount', // discount: 折扣券, cash: 现金券
    value: 88, // 折扣券为折扣金额，现金券为现金金额
    condition: 1000, // 满多少可用
    startTime: '2023-06-01',
    endTime: '2023-08-01',
    isUsed: false,
    isExpired: false,
    categories: ['婚纱', '写真'], // 适用分类
    desc: '仅限于婚纱和写真套餐使用'
  },
  {
    id: '2',
    title: '618促销特惠券',
    type: 'cash',
    value: 50,
    condition: 500,
    startTime: '2023-06-15',
    endTime: '2023-06-20',
    isUsed: false,
    isExpired: false,
    categories: ['全部'],
    desc: '全场通用，无使用限制'
  },
  {
    id: '3',
    title: '毕业季专享券',
    type: 'discount',
    value: 100,
    condition: 1200,
    startTime: '2023-05-20',
    endTime: '2023-07-15',
    isUsed: false,
    isExpired: false,
    categories: ['写真', '毕业照'],
    desc: '限毕业季相关套餐使用'
  },
  {
    id: '4',
    title: '老用户回馈券',
    type: 'cash',
    value: 30,
    condition: 300,
    startTime: '2023-06-01',
    endTime: '2023-06-10',
    isUsed: false,
    isExpired: true,
    categories: ['全部'],
    desc: '已过期'
  },
  {
    id: '5',
    title: '儿童摄影优惠券',
    type: 'discount',
    value: 50,
    condition: 500,
    startTime: '2023-06-01',
    endTime: '2023-07-30',
    isUsed: true,
    isExpired: false,
    categories: ['儿童'],
    desc: '已使用'
  }
]

export default function CouponsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available') // available, used, expired
  const [coupons, setCoupons] = useState([])
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  
  // 选项卡数据
  const tabs = [
    { key: 'available', name: '可用券' },
    { key: 'used', name: '已使用' },
    { key: 'expired', name: '已过期' }
  ]
  
  useEffect(() => {
    // 模拟加载优惠券数据
    const fetchCoupons = () => {
      setLoading(true)
      // 模拟接口请求延迟
      setTimeout(() => {
        let filteredCoupons = [...mockCoupons]
        
        // 根据选项卡筛选
        switch(activeTab) {
          case 'available':
            filteredCoupons = filteredCoupons.filter(coupon => !coupon.isUsed && !coupon.isExpired)
            break
          case 'used':
            filteredCoupons = filteredCoupons.filter(coupon => coupon.isUsed)
            break
          case 'expired':
            filteredCoupons = filteredCoupons.filter(coupon => coupon.isExpired)
            break
          default:
            break
        }
        
        setCoupons(filteredCoupons)
        setLoading(false)
      }, 500)
    }
    
    fetchCoupons()
  }, [activeTab])
  
  // 使用优惠券
  const handleUseCoupon = (couponId) => {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }
  
  // 领取优惠券
  const handleReceiveCoupon = () => {
    setShowReceiveModal(true)
  }
  
  // 关闭领券弹窗
  const closeReceiveModal = () => {
    setShowReceiveModal(false)
  }
  
  // 确认领券
  const confirmReceive = () => {
    Taro.showToast({
      title: '领取成功',
      icon: 'success'
    })
    setShowReceiveModal(false)
    
    // 模拟添加新优惠券
    const newCoupon = {
      id: `new-${Date.now()}`,
      title: '618大促优惠券',
      type: 'cash',
      value: 100,
      condition: 800,
      startTime: '2023-06-18',
      endTime: '2023-06-20',
      isUsed: false,
      isExpired: false,
      categories: ['全部'],
      desc: '618活动期间限时使用'
    }
    
    if (activeTab === 'available') {
      setCoupons([newCoupon, ...coupons])
    }
  }
  
  return (
    <View className='coupons-page'>
      {/* 顶部选项卡 */}
      <View className='tab-bar'>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className='tab-text'>{tab.name}</Text>
          </View>
        ))}
      </View>
      
      {/* 领券入口 */}
      <View className='receive-banner' onClick={handleReceiveCoupon}>
        <Image 
          className='banner-image' 
          src='https://img.icons8.com/doodle/96/000000/discount.png' 
        />
        <View className='banner-content'>
          <Text className='banner-title'>领取优惠券</Text>
          <Text className='banner-desc'>更多优惠等你拿</Text>
        </View>
        <View className='banner-btn'>立即领取</View>
      </View>
      
      {/* 优惠券列表 */}
      <View className='coupon-list'>
        {loading ? (
          <View className='loading'>加载中...</View>
        ) : coupons.length > 0 ? (
          coupons.map(coupon => (
            <View key={coupon.id} className='coupon-item'>
              {/* 左侧金额 */}
              <View className='coupon-left'>
                {coupon.type === 'discount' ? (
                  <View className='value-container'>
                    <Text className='value'>¥{coupon.value}</Text>
                    <Text className='label'>优惠券</Text>
                  </View>
                ) : (
                  <View className='value-container'>
                    <Text className='value'>¥{coupon.value}</Text>
                    <Text className='label'>现金券</Text>
                  </View>
                )}
              </View>
              
              {/* 右侧详情 */}
              <View className='coupon-right'>
                <View className='coupon-info'>
                  <Text className='coupon-title'>{coupon.title}</Text>
                  <Text className='coupon-condition'>满{coupon.condition}元可用</Text>
                  <Text className='coupon-time'>{coupon.startTime} 至 {coupon.endTime}</Text>
                  <Text className='coupon-desc'>{coupon.desc}</Text>
                </View>
                
                <View 
                  className={`coupon-btn ${coupon.isUsed || coupon.isExpired ? 'disabled' : ''}`}
                  onClick={() => !coupon.isUsed && !coupon.isExpired && handleUseCoupon(coupon.id)}
                >
                  {coupon.isUsed ? '已使用' : coupon.isExpired ? '已过期' : '去使用'}
                </View>
              </View>
              
              {/* 优惠券装饰 */}
              <View className='coupon-circle left-top'></View>
              <View className='coupon-circle left-bottom'></View>
              <View className='coupon-circle right-top'></View>
              <View className='coupon-circle right-bottom'></View>
              <View className='coupon-dash'></View>
            </View>
          ))
        ) : (
          <View className='empty-view'>
            <Image 
              className='empty-icon' 
              src='https://img.icons8.com/cotton/64/000000/coupon--v1.png' 
            />
            <Text className='empty-text'>
              {activeTab === 'available' ? '暂无可用优惠券' : 
               activeTab === 'used' ? '暂无已使用优惠券' : '暂无已过期优惠券'}
            </Text>
            {activeTab !== 'available' && (
              <View 
                className='back-btn'
                onClick={() => setActiveTab('available')}
              >
                查看可用优惠券
              </View>
            )}
          </View>
        )}
      </View>
      
      {/* 领取优惠券弹窗 */}
      {showReceiveModal && (
        <View className='receive-modal'>
          <View className='modal-mask' onClick={closeReceiveModal}></View>
          <View className='modal-content'>
            <View className='modal-header'>
              <Text className='modal-title'>领取优惠券</Text>
              <View className='close-btn' onClick={closeReceiveModal}>✕</View>
            </View>
            
            <View className='modal-body'>
              <View className='coupon-preview'>
                <Image 
                  className='coupon-icon' 
                  src='https://img.icons8.com/doodle/96/000000/discount.png'
                />
                <Text className='coupon-name'>618大促优惠券</Text>
                <Text className='coupon-value'>¥100</Text>
                <Text className='coupon-rule'>满800元可用</Text>
              </View>
              
              <View className='rule-text'>
                <Text className='rule-title'>使用规则</Text>
                <Text className='rule-item'>1. 适用于全场商品</Text>
                <Text className='rule-item'>2. 有效期：2023-06-18至2023-06-20</Text>
                <Text className='rule-item'>3. 一个订单限用一张优惠券</Text>
              </View>
            </View>
            
            <Button className='confirm-btn' onClick={confirmReceive}>
              立即领取
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}
