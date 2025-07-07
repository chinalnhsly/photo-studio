import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AppContext } from '@/store'
import './points.scss'

const PointsDetailPage = () => {
  const { state } = useContext(AppContext)
  const [userPoints, setUserPoints] = useState(0)
  const [pointsRecords, setPointsRecords] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 获取积分明细数据
  useEffect(() => {
    const fetchPointsDetail = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 模拟用户积分
          const points = state.user?.points || 2300
          setUserPoints(points)
          
          // 模拟积分记录
          const currentMonth = new Date().getMonth() + 1
          const mockPointsRecords = [
            {
              id: 'r1',
              title: '每日签到',
              points: 10,
              type: 'earn',
              time: `2023-${currentMonth}-${Math.min(new Date().getDate(), 15)}`,
              desc: '连续签到第5天'
            },
            {
              id: 'r2',
              title: '购买服务',
              points: 299,
              type: 'earn',
              time: `2023-${currentMonth}-${Math.min(new Date().getDate() - 1, 15)}`,
              desc: '全家福套餐消费2990元'
            },
            {
              id: 'r3',
              title: '兑换优惠券',
              points: -500,
              type: 'spend',
              time: `2023-${currentMonth}-${Math.min(new Date().getDate() - 2, 14)}`,
              desc: '兑换50元代金券'
            },
            {
              id: 'r4',
              title: '每日签到',
              points: 10,
              type: 'earn',
              time: `2023-${currentMonth}-${Math.min(new Date().getDate() - 2, 14)}`,
              desc: '连续签到第4天'
            },
            {
              id: 'r5',
              title: '每日签到',
              points: 10,
              type: 'earn',
              time: `2023-${currentMonth}-${Math.min(new Date().getDate() - 3, 13)}`,
              desc: '连续签到第3天'
            },
            {
              id: 'r6',
              title: '推荐好友',
              points: 100,
              type: 'earn',
              time: `2023-${currentMonth - 1}-28`,
              desc: '成功推荐好友注册'
            },
            {
              id: 'r7',
              title: '兑换礼品',
              points: -1000,
              type: 'spend',
              time: `2023-${currentMonth - 1}-25`,
              desc: '兑换精美相框'
            },
            {
              id: 'r8',
              title: '购买服务',
              points: 159,
              type: 'earn',
              time: `2023-${currentMonth - 1}-20`,
              desc: '个人写真套餐消费1590元'
            }
          ]
          
          // 按时间排序，最新的在前面
          mockPointsRecords.sort((a, b) => new Date(b.time) - new Date(a.time))
          
          setPointsRecords(mockPointsRecords)
          setLoading(false)
        }, 600)
      } catch (error) {
        console.error('获取积分明细失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchPointsDetail()
  }, [state.user])
  
  // 跳转到积分商城
  const navigateToPointsMall = () => {
    Taro.navigateTo({
      url: '/pages/marketing/points-mall'
    })
  }
  
  // 获取日期字符串
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  return (
    <View className='points-detail-page'>
      <View className='header-section'>
        <View className='points-info'>
          <View className='points-info-left'>
            <Text className='points-label'>我的积分</Text>
            <Text className='points-value'>{userPoints}</Text>
          </View>
          <View 
            className='exchange-btn'
            onClick={navigateToPointsMall}
          >
            去兑换
          </View>
        </View>
      </View>
      
      <View className='rules-card'>
        <View className='rules-header'>
          <Text className='rules-title'>积分规则</Text>
        </View>
        <View className='rules-content'>
          <View className='rules-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>每日签到：+10积分</Text>
          </View>
          <View className='rules-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>消费返积分：消费金额1%</Text>
          </View>
          <View className='rules-item'>
            <Text className='rule-dot'>•</Text>
            <Text className='rule-text'>推荐好友：+100积分/人</Text>
          </View>
        </View>
      </View>
      
      <View className='detail-list'>
        <View className='detail-header'>
          <Text className='detail-title'>积分明细</Text>
        </View>
        
        {pointsRecords.length > 0 ? (
          <View className='records-list'>
            {pointsRecords.map(record => (
              <View key={record.id} className='record-item'>
                <View className='record-left'>
                  <Text className='record-title'>{record.title}</Text>
                  <Text className='record-time'>{formatDate(record.time)}</Text>
                  <Text className='record-desc'>{record.desc}</Text>
                </View>
                <View className='record-right'>
                  <Text className={`record-points ${record.type}`}>
                    {record.type === 'earn' ? '+' : ''}{record.points}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className='empty-records'>
            <Text>暂无积分记录</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default PointsDetailPage
