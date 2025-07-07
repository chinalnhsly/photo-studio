import React, { useState, useEffect } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './detail.scss'

const OrderDetailPage = () => {
  const router = useRouter()
  const { id } = router.params
  
  const [orderInfo, setOrderInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 加载订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 模拟订单数据
          const mockOrderDetail = {
            id,
            orderNo: 'PS' + ('0000000000' + id).slice(-10),
            status: ['unpaid', 'paid', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 5)],
            createTime: '2023-09-15 15:30:22',
            payTime: '2023-09-15 15:35:46',
            totalPrice: 2999,
            originalPrice: 3999,
            discount: 1000,
            productName: '婚纱照套餐',
            productDesc: '三服三造 | 8寸相册 | 20张精修照片 | 赠送原片',
            productImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
            appointmentTime: '2023-10-15 14:00-16:00',
            photographer: '王摄影师',
            location: '海边影棚',
            contact: {
              name: '张先生',
              phone: '138****1234',
              peopleCount: '2人'
            },
            timeline: [
              { time: '2023-09-15 15:30:22', text: '订单创建成功', status: 'done' },
              { time: '2023-09-15 15:35:46', text: '支付成功', status: 'done' },
              { time: '2023-10-15 14:00:00', text: '开始拍摄', status: 'waiting' },
              { time: '2023-10-20 18:00:00', text: '照片制作中', status: 'waiting' },
              { time: '2023-11-01 10:00:00', text: '制作完成', status: 'waiting' }
            ]
          }
          
          // 根据状态更新状态文本
          switch(mockOrderDetail.status) {
            case 'unpaid':
              mockOrderDetail.statusText = '待付款';
              break;
            case 'paid':
              mockOrderDetail.statusText = '待服务';
              break;
            case 'processing':
              mockOrderDetail.statusText = '制作中';
              break;
            case 'completed':
              mockOrderDetail.statusText = '已完成';
              break;
            case 'cancelled':
              mockOrderDetail.statusText = '已取消';
              break;
            default:
              mockOrderDetail.statusText = '未知状态';
          }
          
          setOrderInfo(mockOrderDetail)
          setLoading(false)
        }, 600)
        
      } catch (error) {
        console.error('获取订单详情失败:', error)
        Taro.showToast({
          title: '加载失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    if (id) {
      fetchOrderDetail()
    } else {
      Taro.showToast({
        title: '订单ID不存在',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }, [id])
  
  // 去付款
  const handlePayment = () => {
    Taro.navigateTo({
      url: `/pages/payment/index?orderId=${id}`
    })
  }
  
  // 取消订单
  const handleCancel = () => {
    Taro.showModal({
      title: '取消订单',
      content: '确认取消该订单吗？取消后不可恢复',
      success: (res) => {
        if (res.confirm) {
          // 模拟取消操作
          setOrderInfo(prev => ({
            ...prev,
            status: 'cancelled',
            statusText: '已取消'
          }))
          
          Taro.showToast({
            title: '订单已取消',
            icon: 'success'
          })
        }
      }
    })
  }
  
  // 申请退款
  const handleRefund = () => {
    Taro.showModal({
      title: '申请退款',
      content: '确认申请退款吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateTo({
            url: `/pages/user/orders/refund?id=${id}`
          })
        }
      }
    })
  }
  
  // 评价订单
  const handleReview = () => {
    Taro.navigateTo({
      url: `/pages/user/orders/review?id=${id}`
    })
  }
  
  // 再次购买
  const handleRebuy = () => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${id}`
    })
  }
  
  // 联系客服
  const handleContactService = () => {
    Taro.showToast({
      title: '已复制客服电话',
      icon: 'success'
    })
    Taro.setClipboardData({
      data: '400-888-9999'
    })
  }
  
  // 渲染不同状态下的操作按钮
  const renderActionButtons = () => {
    if (!orderInfo) return null
    
    switch(orderInfo.status) {
      case 'unpaid':
        return (
          <View className='action-buttons'>
            <Button className='action-btn cancel' onClick={handleCancel}>取消订单</Button>
            <Button className='action-btn primary' onClick={handlePayment}>立即支付</Button>
          </View>
        )
      case 'paid':
        return (
          <View className='action-buttons'>
            <Button className='action-btn contact' onClick={handleContactService}>联系客服</Button>
            <Button className='action-btn secondary' onClick={handleRefund}>申请退款</Button>
          </View>
        )
      case 'processing':
        return (
          <View className='action-buttons'>
            <Button className='action-btn contact' onClick={handleContactService}>联系客服</Button>
          </View>
        )
      case 'completed':
        return (
          <View className='action-buttons'>
            <Button className='action-btn secondary' onClick={handleRebuy}>再次购买</Button>
            <Button className='action-btn primary' onClick={handleReview}>评价</Button>
          </View>
        )
      case 'cancelled':
        return (
          <View className='action-buttons'>
            <Button className='action-btn secondary' onClick={handleRebuy}>再次购买</Button>
          </View>
        )
      default:
        return null
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
      </View>
    )
  }
  
  return (
    <View className='order-detail-page'>
      <View className='status-bar'>
        <Text className='status-text'>{orderInfo.statusText}</Text>
      </View>
      
      {/* 订单信息卡片 */}
      <View className='info-card'>
        <View className='order-product'>
          <Image className='product-image' src={orderInfo.productImage} mode='aspectFill' />
          <View className='product-info'>
            <Text className='product-name'>{orderInfo.productName}</Text>
            <Text className='product-desc'>{orderInfo.productDesc}</Text>
            <View className='price-row'>
              <Text className='price'>¥{orderInfo.totalPrice}</Text>
              {orderInfo.discount > 0 && (
                <Text className='original-price'>¥{orderInfo.originalPrice}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* 预约信息卡片 */}
      <View className='info-card'>
        <View className='card-header'>
          <Text className='card-title'>预约信息</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>预约日期</Text>
          <Text className='info-value'>{orderInfo.appointmentTime.split(' ')[0]}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>预约时间</Text>
          <Text className='info-value'>{orderInfo.appointmentTime.split(' ')[1]}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>拍摄地点</Text>
          <Text className='info-value'>{orderInfo.location}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>摄影师</Text>
          <Text className='info-value'>{orderInfo.photographer}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>联系人</Text>
          <Text className='info-value'>{orderInfo.contact.name}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>联系电话</Text>
          <Text className='info-value'>{orderInfo.contact.phone}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>拍摄人数</Text>
          <Text className='info-value'>{orderInfo.contact.peopleCount}</Text>
        </View>
      </View>
      
      {/* 订单信息卡片 */}
      <View className='info-card'>
        <View className='card-header'>
          <Text className='card-title'>订单信息</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>订单编号</Text>
          <Text className='info-value'>{orderInfo.orderNo}</Text>
        </View>
        <View className='info-row'>
          <Text className='info-label'>创建时间</Text>
          <Text className='info-value'>{orderInfo.createTime}</Text>
        </View>
        {orderInfo.status !== 'unpaid' && (
          <View className='info-row'>
            <Text className='info-label'>支付时间</Text>
            <Text className='info-value'>{orderInfo.payTime}</Text>
          </View>
        )}
        <View className='info-row'>
          <Text className='info-label'>订单金额</Text>
          <Text className='info-value price'>¥{orderInfo.totalPrice}</Text>
        </View>
      </View>
      
      {/* 订单进度卡片 */}
      <View className='info-card'>
        <View className='card-header'>
          <Text className='card-title'>订单进度</Text>
        </View>
        <View className='timeline'>
          {orderInfo.timeline.map((item, index) => (
            <View key={index} className={`timeline-item ${item.status}`}>
              <View className='timeline-dot' />
              <View className='timeline-content'>
                <Text className='timeline-text'>{item.text}</Text>
                <Text className='timeline-time'>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* 底部操作按钮 */}
      <View className='bottom-bar'>
        {renderActionButtons()}
      </View>
    </View>
  )
}

export default OrderDetailPage
