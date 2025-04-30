import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const OrderListPage = () => {
  const [tabs] = useState(['全部', '待付款', '待服务', '已完成', '已取消'])
  const [activeTab, setActiveTab] = useState(0)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 加载订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      
      try {
        // 模拟API请求
        setTimeout(() => {
          // 根据不同状态模拟不同订单数据
          let mockOrders = []
          
          // 全部订单
          if (activeTab === 0) {
            mockOrders = [
              {
                id: 'order1',
                orderNo: 'PS202309150001',
                status: 'unpaid',
                statusText: '待付款',
                createTime: '2023-09-15 15:30:22',
                totalPrice: 2999,
                productName: '婚纱照套餐',
                productImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
                appointmentTime: '2023-10-15 14:00-16:00'
              },
              {
                id: 'order2',
                orderNo: 'PS202309120002',
                status: 'paid',
                statusText: '待服务',
                createTime: '2023-09-12 10:25:18',
                totalPrice: 1299,
                productName: '儿童写真套餐',
                productImage: 'https://img.freepik.com/free-photo/full-shot-kid-taking-photos_23-2149029007.jpg',
                appointmentTime: '2023-09-20 10:00-11:30'
              },
              {
                id: 'order3',
                orderNo: 'PS202309010003',
                status: 'completed',
                statusText: '已完成',
                createTime: '2023-09-01 09:15:06',
                totalPrice: 1999,
                productName: '全家福套餐',
                productImage: 'https://img.freepik.com/free-photo/front-view-happy-family-park_23-2148929596.jpg',
                appointmentTime: '2023-09-10 14:00-16:00'
              },
              {
                id: 'order4',
                orderNo: 'PS202308250004',
                status: 'cancelled',
                statusText: '已取消',
                createTime: '2023-08-25 16:42:33',
                totalPrice: 999,
                productName: '个人写真套餐',
                productImage: 'https://img.freepik.com/free-photo/smiley-woman-posing-outdoors_23-2148895799.jpg',
                appointmentTime: '2023-09-05 10:00-11:30'
              }
            ]
          } else if (activeTab === 1) { // 待付款
            mockOrders = [
              {
                id: 'order1',
                orderNo: 'PS202309150001',
                status: 'unpaid',
                statusText: '待付款',
                createTime: '2023-09-15 15:30:22',
                totalPrice: 2999,
                productName: '婚纱照套餐',
                productImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
                appointmentTime: '2023-10-15 14:00-16:00'
              }
            ]
          } else if (activeTab === 2) { // 待服务
            mockOrders = [
              {
                id: 'order2',
                orderNo: 'PS202309120002',
                status: 'paid',
                statusText: '待服务',
                createTime: '2023-09-12 10:25:18',
                totalPrice: 1299,
                productName: '儿童写真套餐',
                productImage: 'https://img.freepik.com/free-photo/full-shot-kid-taking-photos_23-2149029007.jpg',
                appointmentTime: '2023-09-20 10:00-11:30'
              }
            ]
          } else if (activeTab === 3) { // 已完成
            mockOrders = [
              {
                id: 'order3',
                orderNo: 'PS202309010003',
                status: 'completed',
                statusText: '已完成',
                createTime: '2023-09-01 09:15:06',
                totalPrice: 1999,
                productName: '全家福套餐',
                productImage: 'https://img.freepik.com/free-photo/front-view-happy-family-park_23-2148929596.jpg',
                appointmentTime: '2023-09-10 14:00-16:00'
              }
            ]
          } else if (activeTab === 4) { // 已取消
            mockOrders = [
              {
                id: 'order4',
                orderNo: 'PS202308250004',
                status: 'cancelled',
                statusText: '已取消',
                createTime: '2023-08-25 16:42:33',
                totalPrice: 999,
                productName: '个人写真套餐',
                productImage: 'https://img.freepik.com/free-photo/smiley-woman-posing-outdoors_23-2148895799.jpg',
                appointmentTime: '2023-09-05 10:00-11:30'
              }
            ]
          }
          
          setOrders(mockOrders)
          setLoading(false)
        }, 500)
        
      } catch (error) {
        console.error('获取订单列表失败:', error)
        Taro.showToast({
          title: '加载订单失败',
          icon: 'none'
        })
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [activeTab])
  
  // 点击标签页
  const handleTabClick = (index) => {
    setActiveTab(index)
  }
  
  // 查看订单详情
  const navigateToDetail = (orderId) => {
    Taro.navigateTo({
      url: `/pages/user/orders/detail?id=${orderId}`
    })
  }
  
  // 去付款
  const handlePayment = (order) => {
    Taro.navigateTo({
      url: `/pages/payment/index?orderId=${order.id}`
    })
  }
  
  // 取消订单
  const handleCancel = (order) => {
    Taro.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          // 模拟取消操作
          const newOrders = orders.map(item => {
            if (item.id === order.id) {
              return {
                ...item,
                status: 'cancelled',
                statusText: '已取消'
              }
            }
            return item
          })
          
          setOrders(newOrders)
          
          Taro.showToast({
            title: '订单已取消',
            icon: 'success'
          })
        }
      }
    })
  }
  
  // 申请退款
  const handleRefund = (order) => {
    Taro.showModal({
      title: '申请退款',
      content: '确定要申请退款吗？',
      success: function (res) {
        if (res.confirm) {
          // 模拟退款操作
          Taro.showToast({
            title: '退款申请已提交',
            icon: 'success'
          })
        }
      }
    })
  }
  
  // 再次购买
  const handleRebuy = (order) => {
    // 跳转到商品详情页
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${order.id}`
    })
  }
  
  // 渲染订单项
  const renderOrderItem = (order) => {
    // 根据订单状态渲染不同的操作按钮
    const renderActions = () => {
      switch (order.status) {
        case 'unpaid':
          return (
            <View className='order-actions'>
              <View className='action-btn cancel' onClick={() => handleCancel(order)}>取消订单</View>
              <View className='action-btn primary' onClick={() => handlePayment(order)}>立即支付</View>
            </View>
          )
        case 'paid':
          return (
            <View className='order-actions'>
              <View className='action-btn cancel' onClick={() => handleRefund(order)}>申请退款</View>
              <View className='action-btn default' onClick={() => navigateToDetail(order.id)}>查看详情</View>
            </View>
          )
        case 'completed':
          return (
            <View className='order-actions'>
              <View className='action-btn default' onClick={() => handleRebuy(order)}>再次购买</View>
              <View className='action-btn default' onClick={() => navigateToDetail(order.id)}>查看详情</View>
            </View>
          )
        case 'cancelled':
          return (
            <View className='order-actions'>
              <View className='action-btn default' onClick={() => handleRebuy(order)}>再次购买</View>
              <View className='action-btn default' onClick={() => navigateToDetail(order.id)}>查看详情</View>
            </View>
          )
        default:
          return null
      }
    }
    
    return (
      <View key={order.id} className='order-item'>
        <View className='order-header'>
          <Text className='order-no'>订单号：{order.orderNo}</Text>
          <Text className={`order-status ${order.status}`}>{order.statusText}</Text>
        </View>
        
        <View 
          className='order-content'
          onClick={() => navigateToDetail(order.id)}
        >
          <Image className='product-image' src={order.productImage} mode='aspectFill' />
          <View className='product-info'>
            <Text className='product-name'>{order.productName}</Text>
            <Text className='appointment-time'>预约时间：{order.appointmentTime}</Text>
            <View className='price-row'>
              <Text className='price'>¥{order.totalPrice}</Text>
            </View>
          </View>
        </View>
        
        {renderActions()}
      </View>
    )
  }
  
  // 渲染空状态
  const renderEmpty = () => {
    return (
      <View className='empty-orders'>
        <Image 
          className='empty-icon' 
          src='https://img.icons8.com/pastel-glyph/64/000000/purchase-order.png'
        />
        <Text className='empty-text'>暂无订单</Text>
      </View>
    )
  }
  
  return (
    <View className='order-list-page'>
      <View className='tabs'>
        {tabs.map((tab, index) => (
          <Text
            key={index}
            className={`tab-item ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </Text>
        ))}
      </View>
      
      <ScrollView
        className='order-list-scroll'
        scrollY
      >
        {loading ? (
          <View className='loading-container'>加载中...</View>
        ) : orders.length > 0 ? (
          <View className='order-list'>
            {orders.map(order => renderOrderItem(order))}
          </View>
        ) : (
          renderEmpty()
        )}
      </ScrollView>
    </View>
  )
}

export default OrderListPage
