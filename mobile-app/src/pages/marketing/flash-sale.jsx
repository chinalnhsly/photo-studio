import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Button, Progress } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './flash-sale.scss'

const FlashSalePage = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [products, setProducts] = useState([])
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 获取限时抢购数据
  useEffect(() => {
    const fetchFlashSaleData = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 生成抢购时段数据
          const now = new Date()
          const currentHour = now.getHours()
          
          const periodTabs = []
          for (let i = 10; i <= 22; i += 2) {
            const isPast = currentHour > i
            const isCurrent = currentHour >= i && currentHour < (i + 2)
            
            periodTabs.push({
              time: `${i}:00`,
              status: isPast && !isCurrent ? 'ended' : isCurrent ? 'active' : 'upcoming'
            })
          }
          
          setPeriods(periodTabs)
          
          // 设置默认选中的时段
          const activeIndex = periodTabs.findIndex(tab => tab.status === 'active')
          if (activeIndex !== -1) {
            setCurrentTab(activeIndex)
          }
          
          // 生成商品数据
          const mockProducts = [
            {
              id: 'flash1',
              name: '人像写真超值套餐',
              desc: '专业摄影师全程指导，3组造型，20张精修',
              image: 'https://img.freepik.com/free-photo/beautiful-girl-stands-near-walll-with-leaves_8353-5377.jpg',
              originalPrice: 1299,
              flashPrice: 899,
              soldPercent: 75,
              totalStock: 50,
              soldCount: 38
            },
            {
              id: 'flash2',
              name: '情侣照套餐',
              desc: '甜蜜记录，2组造型，15张精修，1个相框',
              image: 'https://img.freepik.com/free-photo/couple-love-together-room_1157-25851.jpg',
              originalPrice: 999,
              flashPrice: 699,
              soldPercent: 45,
              totalStock: 100,
              soldCount: 45
            },
            {
              id: 'flash3',
              name: '精品儿童摄影',
              desc: '记录成长瞬间，多种道具，15张精修照片',
              image: 'https://img.freepik.com/free-photo/beautiful-young-girl-hat-posing-outdoors_1157-27073.jpg',
              originalPrice: 899,
              flashPrice: 599,
              soldPercent: 90,
              totalStock: 30,
              soldCount: 27
            },
            {
              id: 'flash4',
              name: '全家福拍摄',
              desc: '温馨全家福，3-6人，20张精修，1个相册',
              image: 'https://img.freepik.com/free-photo/portrait-happy-family_1303-9779.jpg',
              originalPrice: 1599,
              flashPrice: 1199,
              soldPercent: 60,
              totalStock: 40,
              soldCount: 24
            },
            {
              id: 'flash5',
              name: '商业人像摄影',
              desc: '专业形象照，适合简历、社交媒体等用途',
              image: 'https://img.freepik.com/free-photo/businessman-working-laptop_1388-65.jpg',
              originalPrice: 799,
              flashPrice: 499,
              soldPercent: 30,
              totalStock: 50,
              soldCount: 15
            }
          ]
          
          setProducts(mockProducts)
          
          // 设置倒计时
          const nextPeriodHour = Math.floor((currentHour + 2) / 2) * 2
          const endTime = new Date()
          endTime.setHours(nextPeriodHour, 0, 0, 0)
          
          // 如果已经过了今天最后一场，设置为明天第一场
          if (nextPeriodHour > 22) {
            endTime.setDate(endTime.getDate() + 1)
            endTime.setHours(10, 0, 0, 0)
          }
          
          updateTimeRemaining(endTime)
          
          setLoading(false)
        }, 600)
      } catch (error) {
        console.error('获取限时抢购数据失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchFlashSaleData()
  }, [])
  
  // 更新倒计时
  const updateTimeRemaining = (endTime) => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = Math.max(0, endTime - now) / 1000
      
      if (diff <= 0) {
        clearInterval(timer)
        // 重新加载数据
        window.location.reload()
        return
      }
      
      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = Math.floor(diff % 60)
      
      setTimeRemaining({
        hours,
        minutes,
        seconds
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }
  
  // 处理选项卡点击
  const handleTabClick = (index) => {
    setCurrentTab(index)
    
    // 模拟加载不同时段的商品
    setLoading(true)
    setTimeout(() => {
      // 在实际应用中，这里应该发起API请求获取对应时段的商品
      // 这里仅做模拟
      const shuffledProducts = [...products]
        .sort(() => Math.random() - 0.5)
        .map(product => ({
          ...product,
          soldPercent: Math.floor(Math.random() * 100),
          soldCount: Math.floor(Math.random() * product.totalStock)
        }))
      
      setProducts(shuffledProducts)
      setLoading(false)
    }, 500)
  }
  
  // 处理立即抢购
  const handleBuyNow = (product) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${product.id}&type=flash`
    })
  }
  
  // 进入商品详情
  const handleViewProduct = (product) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${product.id}&type=flash`
    })
  }
  
  // 格式化数字为两位数
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }
  
  // 渲染倒计时组件
  const renderCountdown = () => {
    return (
      <View className='countdown'>
        <Text className='countdown-label'>本场结束还剩</Text>
        <View className='countdown-timer'>
          <View className='time-block'>{formatNumber(timeRemaining.hours)}</View>
          <Text className='time-divider'>:</Text>
          <View className='time-block'>{formatNumber(timeRemaining.minutes)}</View>
          <Text className='time-divider'>:</Text>
          <View className='time-block'>{formatNumber(timeRemaining.seconds)}</View>
        </View>
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
    <View className='flash-sale-page'>
      <View className='header-banner'>
        <Image 
          className='banner-image' 
          src='https://img.freepik.com/free-vector/flash-sale-banner-template_1017-16295.jpg' 
          mode='aspectFill' 
        />
      </View>
      
      <View className='time-tabs'>
        <ScrollView scrollX className='tabs-scroll'>
          {periods.map((period, index) => (
            <View 
              key={`tab-${index}`} 
              className={`tab-item ${currentTab === index ? 'active' : ''} ${period.status}`}
              onClick={() => period.status !== 'ended' && handleTabClick(index)}
            >
              <Text className='tab-time'>{period.time}</Text>
              <Text className='tab-status'>
                {period.status === 'active' ? '抢购中' : 
                  period.status === 'upcoming' ? '即将开始' : '已结束'}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {renderCountdown()}
      
      <View className='products-list'>
        {products.length > 0 ? (
          products.map((product) => (
            <View 
              key={product.id} 
              className='product-item'
              onClick={() => handleViewProduct(product)}
            >
              <Image className='product-image' src={product.image} mode='aspectFill' />
              <View className='product-content'>
                <Text className='product-name'>{product.name}</Text>
                <Text className='product-desc'>{product.desc}</Text>
                <View className='price-row'>
                  <Text className='flash-price'>¥{product.flashPrice}</Text>
                  <Text className='original-price'>¥{product.originalPrice}</Text>
                </View>
                
                <View className='sales-progress'>
                  <Progress 
                    percent={product.soldPercent} 
                    strokeWidth={4}
                    activeColor='#ff6b81'
                    backgroundColor='#f0f0f0'
                  />
                  <Text className='progress-text'>
                    已售{product.soldCount}/{product.totalStock}
                  </Text>
                </View>
                
                <Button 
                  className='buy-now-btn'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBuyNow(product)
                  }}
                >
                  立即抢购
                </Button>
              </View>
            </View>
          ))
        ) : (
          <View className='empty-products'>
            <Text>暂无抢购商品</Text>
          </View>
        )}
      </View>
      
      <View className='rules-section'>
        <View className='rules-header'>
          <Text className='rules-title'>活动规则</Text>
        </View>
        <View className='rules-content'>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每个时段限时抢购商品不同，请留意场次信息</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>抢购商品数量有限，先到先得</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每人每个商品限购1件</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>如有任何问题，请联系客服400-888-9999</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FlashSalePage