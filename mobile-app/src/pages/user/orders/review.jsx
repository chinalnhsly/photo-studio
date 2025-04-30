import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button, Textarea } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './review.scss'

const OrderReviewPage = () => {
  const router = useRouter()
  const { id } = router.params
  
  const [orderInfo, setOrderInfo] = useState(null)
  const [review, setReview] = useState({
    content: '',
    photos: [],
    rating: 5, // 默认5星
    anonymous: false // 是否匿名评价
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // 获取订单信息
  useEffect(() => {
    const fetchOrderInfo = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          const mockOrder = {
            id,
            orderNo: 'PS' + ('0000000000' + id).slice(-10),
            productName: '婚纱照套餐',
            productDesc: '三服三造 | 8寸相册 | 20张精修照片 | 赠送原片',
            productImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
            totalPrice: 2999,
          }
          
          setOrderInfo(mockOrder)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('获取订单信息失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    if (id) {
      fetchOrderInfo()
    }
  }, [id])
  
  // 处理评价内容变化
  const handleContentChange = (e) => {
    setReview(prev => ({
      ...prev,
      content: e.detail.value
    }))
  }
  
  // 处理评分变化
  const handleRatingChange = (rating) => {
    setReview(prev => ({
      ...prev,
      rating
    }))
  }
  
  // 切换匿名评价
  const toggleAnonymous = () => {
    setReview(prev => ({
      ...prev,
      anonymous: !prev.anonymous
    }))
  }
  
  // 选择照片
  const handleSelectPhotos = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - review.photos.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      
      const newPhotos = [...review.photos, ...res.tempFilePaths]
      setReview(prev => ({
        ...prev,
        photos: newPhotos.slice(0, 9) // 最多9张
      }))
    } catch (error) {
      console.log('用户取消了选择')
    }
  }
  
  // 删除照片
  const handleDeletePhoto = (index) => {
    const newPhotos = [...review.photos]
    newPhotos.splice(index, 1)
    setReview(prev => ({
      ...prev,
      photos: newPhotos
    }))
  }
  
  // 提交评价
  const handleSubmit = async () => {
    if (!review.content.trim()) {
      Taro.showToast({
        title: '请输入评价内容',
        icon: 'none'
      })
      return
    }
    
    setSubmitting(true)
    
    try {
      // 模拟提交评价
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      Taro.showToast({
        title: '评价成功',
        icon: 'success'
      })
      
      // 返回订单详情
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
      
    } catch (error) {
      Taro.showToast({
        title: '评价失败，请重试',
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
  
  return (
    <View className='review-page'>
      {/* 商品信息 */}
      <View className='product-card'>
        <Image className='product-image' src={orderInfo?.productImage} mode='aspectFill' />
        <View className='product-info'>
          <Text className='product-name'>{orderInfo?.productName}</Text>
          <Text className='product-desc'>{orderInfo?.productDesc}</Text>
        </View>
      </View>
      
      {/* 评分 */}
      <View className='rating-section'>
        <Text className='section-title'>服务评分</Text>
        <View className='rating-stars'>
          {[1, 2, 3, 4, 5].map(star => (
            <View 
              key={star} 
              className={`star ${review.rating >= star ? 'active' : ''}`} 
              onClick={() => handleRatingChange(star)}
            >
              ★
            </View>
          ))}
          <Text className='rating-text'>
            {['', '非常差', '较差', '一般', '满意', '非常满意'][review.rating]}
          </Text>
        </View>
      </View>
      
      {/* 评价内容 */}
      <View className='content-section'>
        <Text className='section-title'>评价内容</Text>
        <Textarea
          className='review-textarea'
          placeholder='请分享您的使用体验和感受，帮助其他用户做出选择...'
          maxlength={500}
          value={review.content}
          onInput={handleContentChange}
        />
        <Text className='word-count'>{review.content.length}/500</Text>
      </View>
      
      {/* 上传照片 */}
      <View className='photos-section'>
        <Text className='section-title'>添加照片</Text>
        <View className='photos-grid'>
          {review.photos.map((photo, index) => (
            <View key={index} className='photo-item'>
              <Image className='photo' src={photo} mode='aspectFill' />
              <View className='delete-btn' onClick={() => handleDeletePhoto(index)}>×</View>
            </View>
          ))}
          
          {review.photos.length < 9 && (
            <View className='photo-upload' onClick={handleSelectPhotos}>
              <View className='upload-icon'>+</View>
              <Text className='upload-text'>{review.photos.length}/9</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* 匿名评价 */}
      <View className='anonymous-section' onClick={toggleAnonymous}>
        <View className={`checkbox ${review.anonymous ? 'checked' : ''}`}>
          {review.anonymous && <View className='check'>✓</View>}
        </View>
        <Text className='anonymous-text'>匿名评价</Text>
      </View>
      
      {/* 提交按钮 */}
      <View className='submit-section'>
        <Button 
          className='submit-btn' 
          loading={submitting}
          onClick={handleSubmit}
        >
          提交评价
        </Button>
      </View>
    </View>
  )
}

export default OrderReviewPage
