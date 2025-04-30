import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './coupons.scss'

const CouponsPage = () => {
  const [tabs] = useState(['可使用', '已过期', '已使用'])
  const [currentTab, setCurrentTab] = useState(0)
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 获取优惠券数据
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 模拟优惠券数据
          const mockCoupons = [
            {
              id: 'c1',
              name: '新人专享券',
              desc: '新用户首单可用',
              discount: 100,
              minSpend: 0,
              startDate: '2023-09-01',
              endDate: '2023-12-31',
              status: 'valid',
              usageScope: '全场通用',
              code: 'NEWUSER100'
            },
            {
              id: 'c2',
              name: '满减优惠券',
              desc: '满1000减150',
              discount: 150,
              minSpend: 1000,
              startDate: '2023-09-15',
              endDate: '2023-10-15',
              status: 'valid',
              usageScope: '婚纱摄影套餐专用',
              code: 'WEDDING150'
            },
            {
              id: 'c3',
              name: '限时特惠券',
              desc: '周末限定使用',
              discount: 50,
              minSpend: 500,
              startDate: '2023-09-20',
              endDate: '2023-09-30',
              status: 'expired',
              usageScope: '全场通用',
              code: 'WEEKEND50'
            },
            {
              id: 'c4',
              name: '生日专享券',
              desc: '生日当月可用',
              discount: 120,
              minSpend: 600,
              startDate: '2023-08-01',
              endDate: '2023-08-31',
              status: 'used',
              usageScope: '个人写真专用',
              usedTime: '2023-08-15',
              orderNo: 'PS202308150023',
              code: 'BIRTH120'
            },
            {
              id: 'c5',
              name: '会员专享券',
              desc: '银卡及以上会员可用',
              discount: 200,
              minSpend: 1500,
              startDate: '2023-09-01',
              endDate: '2023-12-31',
              status: 'valid',
              usageScope: '全场通用',
              code: 'VIP200'
            }
          ]
          
          setCoupons(mockCoupons)
          setLoading(false)
        }, 600)
      } catch (error) {
        console.error('获取优惠券数据失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchCoupons()
  }, [])
  
  // 处理标签切换
  const handleTabChange = (index) => {
    setCurrentTab(index)
  }
  
  // 跳转到领券中心
  const navigateToCouponCenter = () => {
    Taro.navigateTo({
      url: '/pages/marketing/new-coupons'
    })
  }
  
  // 使用优惠券
  const handleUseCoupon = (coupon) => {
    // 跳转到商品列表页
    Taro.switchTab({
      url: '/pages/category/index'
    })
  }
  
  // 格式化日期
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}.${date.getDate()}`
  }
  
  // 过滤优惠券
  const getFilteredCoupons = () => {
    switch (currentTab) {
      case 0: // 可使用
        return coupons.filter(coupon => coupon.status === 'valid')
      case 1: // 已过期
        return coupons.filter(coupon => coupon.status === 'expired')
      case 2: // 已使用
        return coupons.filter(coupon => coupon.status === 'used')
      default:
        return []
    }
  }
  
  // 渲染优惠券
  const renderCoupon = (coupon) => {
    return (
      <View key={coupon.id} className={`coupon-item ${coupon.status}`}>
        <View className='coupon-left'>
          <Text className='discount-value'>¥{coupon.discount}</Text>
          {coupon.minSpend > 0 && (
            <Text className='discount-condition'>满{coupon.minSpend}可用</Text>
          )}
        </View>
        <View className='coupon-right'>
          <Text className='coupon-name'>{coupon.name}</Text>
          <Text className='coupon-desc'>{coupon.desc}</Text>
          <Text className='coupon-scope'>{coupon.usageScope}</Text>
          <View className='coupon-bottom'>
            <Text className='coupon-time'>
              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
            </Text>
            {coupon.status === 'valid' && (
              <View className='use-btn' onClick={() => handleUseCoupon(coupon)}>
                立即使用
              </View>
            )}
            {coupon.status === 'used' && (
              <Text className='used-tag'>已使用</Text>
            )}
            {coupon.status === 'expired' && (
              <Text className='expired-tag'>已过期</Text>
            )}
          </View>
        </View>
        <View className='coupon-circle top'></View>
        <View className='coupon-circle bottom'></View>
      </View>
    )
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  return (
    <View className='coupons-page'>
      <View className='tabs-section'>
        <View className='tabs-header'>
          {tabs.map((tab, index) => (
            <Text 
              key={tab}
              className={`tab-item ${currentTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab}
            </Text>
          ))}
        </View>
      </View>
      
      <View className='coupon-list'>
        {getFilteredCoupons().length > 0 ? (
          getFilteredCoupons().map(coupon => renderCoupon(coupon))
        ) : (
          <View className='empty-coupons'>
            <Image 
              className='empty-icon'
              src='https://img.icons8.com/pastel-glyph/64/000000/discount--v1.png'
            />
            <Text className='empty-text'>
              {currentTab === 0 ? '暂无可用优惠券' : 
                currentTab === 1 ? '暂无已过期优惠券' : '暂无已使用优惠券'}
            </Text>
            {currentTab === 0 && (
              <View className='get-btn' onClick={navigateToCouponCenter}>去领券</View>
            )}
          </View>
        )}
      </View>
      
      {currentTab === 0 && getFilteredCoupons().length > 0 && (
        <View className='footer-action'>
          <View className='action-btn' onClick={navigateToCouponCenter}>
            领取更多优惠券
          </View>
        </View>
      )}
    </View>
  )
}

export default CouponsPage
