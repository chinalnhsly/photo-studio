import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const GroupBuyPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [groupBuyList, setGroupBuyList] = useState([])
  const [loading, setLoading] = useState(true)

  const tabs = ['全部团购', '最新上线', '即将结束']

  useEffect(() => {
    fetchGroupBuyList()
  }, [activeTab])

  // 获取团购数据
  const fetchGroupBuyList = async () => {
    setLoading(true)
    try {
      // 模拟API请求
      setTimeout(() => {
        const mockData = [
          {
            id: 'gb001',
            title: '情侣写真双人套餐',
            image: 'https://img.freepik.com/free-photo/loving-couple-posing-beach_23-2149163689.jpg',
            originalPrice: 1299,
            groupPrice: 899,
            minGroupSize: 3,
            currentGroupSize: 2,
            soldCount: 28,
            endTime: Date.now() + 86400000 * 2, // 2天后结束
            status: 'active'
          },
          {
            id: 'gb002',
            title: '全家福定制拍摄',
            image: 'https://img.freepik.com/free-photo/happy-family-park_1157-21454.jpg',
            originalPrice: 1999,
            groupPrice: 1499,
            minGroupSize: 2,
            currentGroupSize: 1,
            soldCount: 15,
            endTime: Date.now() + 86400000 * 5, // 5天后结束
            status: 'active'
          },
          {
            id: 'gb003',
            title: '宝宝百日照精选套餐',
            image: 'https://img.freepik.com/free-photo/little-baby-lying-basket_1157-18285.jpg',
            originalPrice: 1599,
            groupPrice: 999,
            minGroupSize: 3,
            currentGroupSize: 3,
            soldCount: 36,
            endTime: Date.now() + 43200000, // 12小时后结束
            status: 'active'
          },
          {
            id: 'gb004',
            title: '商业形象照精修',
            image: 'https://img.freepik.com/free-photo/portrait-young-businessman-office_23-2147770393.jpg',
            originalPrice: 999,
            groupPrice: 699,
            minGroupSize: 4,
            currentGroupSize: 2,
            soldCount: 24,
            endTime: Date.now() + 86400000 * 3, // 3天后结束
            status: 'active'
          }
        ]

        // 根据不同标签过滤数据
        let filteredData = mockData
        if (activeTab === 1) {
          // 最新上线：按ID倒序（模拟按创建时间）
          filteredData = [...mockData].sort((a, b) => b.id.localeCompare(a.id))
        } else if (activeTab === 2) {
          // 即将结束：按结束时间升序
          filteredData = [...mockData].sort((a, b) => a.endTime - b.endTime)
        }

        setGroupBuyList(filteredData)
        setLoading(false)
      }, 600)
    } catch (error) {
      console.error('获取团购列表失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
      setLoading(false)
    }
  }

  // 处理标签切换
  const handleTabChange = (index) => {
    setActiveTab(index)
  }

  // 格式化倒计时
  const formatCountdown = (endTime) => {
    const diff = endTime - Date.now()
    if (diff <= 0) return '已结束'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `剩余${days}天${hours}小时`
    }
    return `剩余${hours}小时${minutes}分钟`
  }

  // 团购详情
  const handleViewDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/marketing/group-buy/detail?id=${id}`
    })
  }

  // 立即参团
  const handleJoinGroup = (id) => {
    Taro.navigateTo({
      url: `/pages/marketing/group-buy/detail?id=${id}&action=join`
    })
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='group-buy-page'>
      {/* 头部横幅 */}
      <View className='header-banner'>
        <Image 
          className='banner-image'
          src='https://img.freepik.com/free-vector/flat-sale-banner-with-photo_23-2149026968.jpg'
          mode='aspectFill'
        />
      </View>

      {/* 标签页 */}
      <View className='tab-section'>
        <View className='tab-header'>
          {tabs.map((tab, index) => (
            <Text 
              key={index} 
              className={`tab-item ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab}
            </Text>
          ))}
        </View>
      </View>

      {/* 团购列表 */}
      <View className='group-buy-list'>
        {groupBuyList.map(item => (
          <View key={item.id} className='group-buy-item' onClick={() => handleViewDetail(item.id)}>
            <Image className='item-image' src={item.image} mode='aspectFill' />
            <View className='item-content'>
              <Text className='item-title'>{item.title}</Text>
              <View className='group-info'>
                <Text className='group-size'>{item.currentGroupSize}/{item.minGroupSize}人团</Text>
                <Text className='group-time'>{formatCountdown(item.endTime)}</Text>
              </View>
              <View className='price-row'>
                <View className='price-info'>
                  <Text className='group-price'>¥{item.groupPrice}</Text>
                  <Text className='original-price'>¥{item.originalPrice}</Text>
                </View>
                <View className='join-btn' onClick={(e) => {
                  e.stopPropagation();
                  handleJoinGroup(item.id);
                }}>
                  立即参团
                </View>
              </View>
              <Text className='sold-count'>已售{item.soldCount}件</Text>
            </View>
          </View>
        ))}
      </View>
      
      {/* 团购规则说明 */}
      <View className='rules-section'>
        <View className='rules-header'>
          <Text className='rules-title'>团购规则</Text>
        </View>
        <View className='rules-content'>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>开团后24小时内邀请好友参团</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>达到成团人数即可享受团购价</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>未成团自动退款至支付账户</Text>
          </View>
          <View className='rule-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每个用户限参与1次同一团购活动</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default GroupBuyPage
