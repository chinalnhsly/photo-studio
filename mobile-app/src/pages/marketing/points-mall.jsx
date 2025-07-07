import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AppContext } from '@/store'
import './points-mall.scss'

const PointsMallPage = () => {
  const { state } = useContext(AppContext)
  const [categories] = useState(['全部', '优惠券', '实物礼品', '摄影服务'])
  const [currentTab, setCurrentTab] = useState(0)
  const [pointsItems, setPointsItems] = useState([])
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  
  // 获取积分商城数据
  useEffect(() => {
    const fetchPointsData = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 模拟用户积分
          const points = state.user?.points || 2300
          setUserPoints(points)
          
          // 模拟积分商品数据
          const mockPointsItems = [
            {
              id: 'p1',
              name: '50元代金券',
              points: 500,
              type: '优惠券',
              image: 'https://img.freepik.com/free-vector/coupon-design-template-with-best-offer-details_1017-30304.jpg',
              sold: 240,
              limit: 1,
              desc: '可用于任意摄影套餐抵扣,无门槛'
            },
            {
              id: 'p2',
              name: '精美相框',
              points: 1000,
              type: '实物礼品',
              image: 'https://img.freepik.com/free-vector/blank-picture-frame_53876-89302.jpg',
              sold: 98,
              limit: 2,
              desc: '7寸精美木质相框，可装裱照片'
            },
            {
              id: 'p3',
              name: '追光灯使用权',
              points: 300,
              type: '摄影服务',
              image: 'https://img.freepik.com/free-photo/light-lamp-interior-decoration_74190-7126.jpg',
              sold: 155,
              limit: 1,
              desc: '拍摄时免费使用专业追光灯一次'
            },
            {
              id: 'p4',
              name: '100元代金券',
              points: 900,
              type: '优惠券',
              image: 'https://img.freepik.com/free-vector/coupon-design-template-with-best-offer-details_1017-30304.jpg',
              sold: 320,
              limit: 1,
              desc: '满1000元可用，不可与其他优惠同享'
            },
            {
              id: 'p5',
              name: '精美小礼品',
              points: 600,
              type: '实物礼品',
              image: 'https://img.freepik.com/free-photo/gift-box-with-red-ribbon_1220-4311.jpg',
              sold: 76,
              limit: 3,
              desc: '精美小礼品一份，随机发放'
            },
            {
              id: 'p6',
              name: '写真加拍5张',
              points: 800,
              type: '摄影服务',
              image: 'https://img.freepik.com/free-photo/photographer-taking-photos-studio_23-2149072334.jpg',
              sold: 45,
              limit: 1,
              desc: '任意写真套餐可额外加拍5张'
            }
          ]
          
          setPointsItems(mockPointsItems)
          setLoading(false)
        }, 600)
      } catch (error) {
        console.error('获取积分商城数据失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchPointsData()
  }, [state.user])
  
  // 处理标签切换
  const handleTabChange = (index) => {
    setCurrentTab(index)
  }
  
  // 处理兑换商品
  const handleRedeem = (item) => {
    // 检查积分是否足够
    if (userPoints < item.points) {
      Taro.showToast({
        title: '积分不足',
        icon: 'none'
      })
      return
    }
    
    Taro.showModal({
      title: '确认兑换',
      content: `确定使用${item.points}积分兑换"${item.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          // 模拟兑换请求
          Taro.showLoading({
            title: '兑换中...'
          })
          
          setTimeout(() => {
            Taro.hideLoading()
            
            // 更新用户积分
            setUserPoints(prev => prev - item.points)
            
            Taro.showToast({
              title: '兑换成功',
              icon: 'success'
            })
            
            // 如果是优惠券，可以跳转到优惠券列表
            if (item.type === '优惠券') {
              setTimeout(() => {
                Taro.navigateTo({
                  url: '/pages/marketing/coupons'
                })
              }, 1500)
            }
          }, 1000)
        }
      }
    })
  }
  
  // 跳转到积分明细页面
  const navigateToPointsDetail = () => {
    Taro.navigateTo({
      url: '/pages/marketing/points'
    })
  }
  
  // 过滤商品列表
  const getFilteredItems = () => {
    if (currentTab === 0) return pointsItems
    
    return pointsItems.filter(item => item.type === categories[currentTab])
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  return (
    <View className='points-mall-page'>
      <View className='header-section'>
        <View className='points-info'>
          <Text className='points-label'>我的积分</Text>
          <Text className='points-value'>{userPoints}</Text>
          <Text 
            className='points-detail'
            onClick={navigateToPointsDetail}
          >
            积分明细 〉
          </Text>
        </View>
      </View>
      
      <View className='category-tabs'>
        {categories.map((category, index) => (
          <Text 
            key={category}
            className={`tab-item ${currentTab === index ? 'active' : ''}`}
            onClick={() => handleTabChange(index)}
          >
            {category}
          </Text>
        ))}
      </View>
      
      <View className='items-list'>
        {getFilteredItems().length > 0 ? (
          getFilteredItems().map(item => (
            <View key={item.id} className='item-card'>
              <Image className='item-image' src={item.image} mode='aspectFill' />
              <View className='item-info'>
                <Text className='item-name'>{item.name}</Text>
                <Text className='item-desc'>{item.desc}</Text>
                <View className='item-bottom'>
                  <View className='points-required'>
                    <Text className='points-num'>{item.points}</Text>
                    <Text className='points-text'>积分</Text>
                  </View>
                  <Text className='item-sold'>已兑换: {item.sold}</Text>
                </View>
                <View 
                  className={`redeem-btn ${userPoints < item.points ? 'disabled' : ''}`}
                  onClick={() => handleRedeem(item)}
                >
                  {userPoints < item.points ? '积分不足' : '立即兑换'}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className='empty-items'>
            <Text>暂无可兑换商品</Text>
          </View>
        )}
      </View>
      
      <View className='mall-notice'>
        <View className='notice-header'>
          <Text className='notice-title'>兑换须知</Text>
        </View>
        <View className='notice-content'>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>积分兑换后不可退还</Text>
          </View>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>实物礼品将在7个工作日内发出</Text>
          </View>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>优惠券兑换后可在"我的优惠券"中查看</Text>
          </View>
          <View className='notice-item'>
            <Text className='notice-dot'>•</Text>
            <Text className='notice-text'>如有问题请联系客服: 400-888-9999</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default PointsMallPage
