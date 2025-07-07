import React, { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './detail.scss'

const GroupBuyDetail = () => {
  const router = useRouter()
  const { id, action } = router.params
  
  const [productDetail, setProductDetail] = useState(null)
  const [currentGroups, setCurrentGroups] = useState([])
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchGroupBuyDetail()
  }, [id])
  
  // 倒计时效果
  useEffect(() => {
    if (!productDetail) return
    
    const timer = setInterval(() => {
      const diff = productDetail.endTime - Date.now()
      if (diff <= 0) {
        clearInterval(timer)
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setTimeRemaining({ days, hours, minutes, seconds })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [productDetail])
  
  // 获取团购详情数据
  const fetchGroupBuyDetail = async () => {
    setLoading(true)
    try {
      // 模拟API请求
      setTimeout(() => {
        // 模拟产品详情
        const productData = {
          id,
          title: '情侣写真双人套餐',
          bannerImages: [
            'https://img.freepik.com/free-photo/loving-couple-posing-beach_23-2149163689.jpg',
            'https://img.freepik.com/free-photo/side-view-couple-outdoors_23-2149163709.jpg',
            'https://img.freepik.com/free-photo/side-view-couple-beach_23-2149163699.jpg'
          ],
          originalPrice: 1299,
          groupPrice: 899,
          minGroupSize: 3,
          totalSold: 28,
          endTime: Date.now() + 86400000 * 2, // 2天后结束
          startTime: Date.now() - 86400000 * 3, // 3天前开始
          description: '【情侣写真特惠团购】专享价899元（原价1299元），3人成团，内含：\n\n· 3组不同场景拍摄\n· 30张精修照片电子版\n· 1本6寸精美相册\n· 2小时拍摄时长\n· 提供服装道具\n· 专业摄影师全程指导\n\n活动有效期：购买后3个月内有效，节假日可用',
          packageIncludes: [
            '3组不同场景拍摄',
            '30张精修照片电子版',
            '1本6寸精美相册',
            '2小时拍摄时长',
            '提供服装道具',
            '专业摄影师全程指导'
          ],
          notes: [
            '需提前3天预约拍摄时间',
            '团购券有效期为3个月',
            '节假日可用，周末需提前一周预约',
            '每个ID限购一次',
            '未成团自动退款'
          ]
        }
        
        // 模拟当前团列表
        const groupsData = [
          {
            id: 'g001',
            initiator: '张先生',
            avatar: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg',
            remainingTime: Date.now() + 3600000 * 5, // 5小时后结束
            currentSize: 2,
            minSize: 3,
            members: [
              { id: 'm1', avatar: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' },
              { id: 'm2', avatar: 'https://img.freepik.com/free-photo/pretty-smiling-joyfully-female-with-fair-hair-dressed-casually-looking-with-satisfaction_176420-15187.jpg' }
            ]
          },
          {
            id: 'g002',
            initiator: '李女士',
            avatar: 'https://img.freepik.com/free-photo/cheerful-curly-business-girl-wearing-glasses_176420-206.jpg',
            remainingTime: Date.now() + 3600000 * 3, // 3小时后结束
            currentSize: 1,
            minSize: 3,
            members: [
              { id: 'm3', avatar: 'https://img.freepik.com/free-photo/cheerful-curly-business-girl-wearing-glasses_176420-206.jpg' }
            ]
          }
        ]
        
        setProductDetail(productData)
        setCurrentGroups(groupsData)
        
        // 如果参数包含action=join，弹出选择现有团组的提示
        if (action === 'join') {
          setTimeout(() => {
            Taro.showActionSheet({
              itemList: ['开新团', '加入张先生的团', '加入李女士的团'],
              success: function (res) {
                if (res.tapIndex === 0) {
                  handleNewGroup()
                } else {
                  handleJoinExistingGroup(groupsData[res.tapIndex - 1])
                }
              }
            })
          }, 500)
        }
        
        setLoading(false)
      }, 600)
    } catch (error) {
      console.error('获取团购详情失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
      setLoading(false)
    }
  }
  
  // 开新团
  const handleNewGroup = () => {
    Taro.navigateTo({
      url: `/pages/payment/index?id=${id}&type=groupbuy&action=new`
    })
  }
  
  // 加入已有团
  const handleJoinExistingGroup = (group) => {
    Taro.navigateTo({
      url: `/pages/payment/index?id=${id}&type=groupbuy&action=join&groupId=${group.id}`
    })
  }
  
  // 分享给好友
  const handleShareToFriend = () => {
    Taro.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    })
  }
  
  // 格式化数字为两位数
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }
  
  // 格式化剩余时间
  const formatGroupTime = (endTime) => {
    const diff = endTime - Date.now()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hours}小时${minutes}分钟`
  }
  
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  if (!productDetail) {
    return (
      <View className='error-container'>
        <Text>团购信息不存在</Text>
      </View>
    )
  }

  return (
    <View className='group-buy-detail'>
      {/* 轮播图 */}
      <Swiper 
        className='banner-swiper'
        indicatorColor='#ffffff50'
        indicatorActiveColor='#ffffff'
        circular
        indicatorDots
        autoplay
      >
        {productDetail.bannerImages.map((image, index) => (
          <SwiperItem key={index}>
            <Image className='banner-image' src={image} mode='aspectFill' />
          </SwiperItem>
        ))}
      </Swiper>
      
      {/* 产品信息 */}
      <View className='product-info-card'>
        <View className='price-section'>
          <View className='price-info'>
            <Text className='group-price'>¥{productDetail.groupPrice}</Text>
            <Text className='original-price'>¥{productDetail.originalPrice}</Text>
          </View>
          <View className='group-tag'>
            <Text className='tag-text'>{productDetail.minGroupSize}人团</Text>
          </View>
        </View>
        
        <Text className='product-title'>{productDetail.title}</Text>
        
        <View className='countdown-section'>
          <Text className='countdown-label'>距离结束还剩</Text>
          <View className='countdown-timer'>
            <View className='time-block'>{formatNumber(timeRemaining.days)}</View>
            <Text className='time-separator'>天</Text>
            <View className='time-block'>{formatNumber(timeRemaining.hours)}</View>
            <Text className='time-separator'>时</Text>
            <View className='time-block'>{formatNumber(timeRemaining.minutes)}</View>
            <Text className='time-separator'>分</Text>
            <View className='time-block'>{formatNumber(timeRemaining.seconds)}</View>
            <Text className='time-separator'>秒</Text>
          </View>
        </View>
        
        <View className='sales-info'>
          <Text className='sold-text'>已售 {productDetail.totalSold} 件</Text>
        </View>
      </View>
      
      {/* 当前团信息 */}
      <View className='current-groups-card'>
        <View className='card-title'>
          <Text className='title-text'>正在进行的团</Text>
          <Text className='subtitle-text'>{currentGroups.length}个团正在进行中</Text>
        </View>
        
        {currentGroups.length > 0 ? (
          <View className='groups-list'>
            {currentGroups.map(group => (
              <View key={group.id} className='group-item'>
                <View className='group-header'>
                  <Image className='initiator-avatar' src={group.avatar} />
                  <Text className='initiator-name'>{group.initiator}</Text>
                  <Text className='time-remaining'>剩余 {formatGroupTime(group.remainingTime)}</Text>
                </View>
                
                <View className='group-members'>
                  {group.members.map(member => (
                    <Image key={member.id} className='member-avatar' src={member.avatar} />
                  ))}
                  
                  {/* 显示还缺几人 */}
                  {Array(group.minSize - group.currentSize).fill().map((_, index) => (
                    <View key={`placeholder-${index}`} className='avatar-placeholder'>
                      <Text className='placeholder-text'>?</Text>
                    </View>
                  ))}
                </View>
                
                <View className='group-progress'>
                  <Text className='progress-text'>还差{group.minSize - group.currentSize}人成团</Text>
                  <Button 
                    className='join-btn' 
                    onClick={() => handleJoinExistingGroup(group)}
                  >
                    去参团
                  </Button>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className='empty-groups'>
            <Text>暂无进行中的团，开团享优惠</Text>
          </View>
        )}
      </View>
      
      {/* 商品详情 */}
      <View className='product-detail-card'>
        <View className='card-title'>
          <Text className='title-text'>套餐包含</Text>
        </View>
        <View className='package-list'>
          {productDetail.packageIncludes.map((item, index) => (
            <View key={index} className='package-item'>
              <Text className='item-dot'>•</Text>
              <Text className='item-text'>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* 购买须知 */}
      <View className='notes-card'>
        <View className='card-title'>
          <Text className='title-text'>购买须知</Text>
        </View>
        <View className='notes-list'>
          {productDetail.notes.map((note, index) => (
            <View key={index} className='note-item'>
              <Text className='item-num'>{index + 1}.</Text>
              <Text className='note-text'>{note}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* 底部操作栏 */}
      <View className='action-bar'>
        <View className='action-left'>
          <View className='action-item' onClick={handleShareToFriend}>
            <View className='action-icon share-icon'>
              <Text className='icon-inner'>分</Text>
            </View>
            <Text className='action-text'>分享</Text>
          </View>
        </View>
        
        <View className='action-buttons'>
          <Button className='action-btn join-btn' onClick={() => {
            if (currentGroups.length > 0) {
              Taro.showActionSheet({
                itemList: ['开新团', ...currentGroups.map(g => `加入${g.initiator}的团`)],
                success: function (res) {
                  if (res.tapIndex === 0) {
                    handleNewGroup()
                  } else {
                    handleJoinExistingGroup(currentGroups[res.tapIndex - 1])
                  }
                }
              })
            } else {
              handleNewGroup()
            }
          }}>
            {currentGroups.length > 0 ? '加入团购' : '开团享优惠'}
          </Button>
          
          <Button className='action-btn new-btn' onClick={handleNewGroup}>
            ¥{productDetail.groupPrice} 开新团
          </Button>
        </View>
      </View>
    </View>
  )
}

export default GroupBuyDetail
