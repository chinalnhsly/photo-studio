import React, { useState } from 'react'
import { View, Swiper, SwiperItem, ScrollView, Image, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import ProductCard from '../../components/ProductCard'
import './index.scss'

// Mock数据，实际项目中从API获取
const banners = [
  { id: '1', image: 'https://images.unsplash.com/photo-1534625647344-6d1b41993717', link: '/pages/activity/detail?id=1' },
  { id: '2', image: 'https://images.unsplash.com/photo-1519741497674-611481863552', link: '/pages/activity/detail?id=2' },
  { id: '3', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', link: '/pages/activity/detail?id=3' }
]

const categories = [
  { id: '1', name: '婚纱摄影', icon: '👰' },
  { id: '2', name: '儿童摄影', icon: '👶' },
  { id: '3', name: '写真', icon: '📸' },
  { id: '4', name: '全家福', icon: '👨‍👩‍👧' },
  { id: '5', name: '毕业照', icon: '🎓' },
  { id: '6', name: '证件照', icon: '🪪' },
  { id: '7', name: '活动跟拍', icon: '🎬' },
  { id: '8', name: '更多', icon: '⋯' }
]

const products = [
  {
    id: '1',
    name: '高级婚纱摄影套餐',
    image: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
    price: 3999,
    originalPrice: 5999,
    sales: 156,
    category: '婚纱'
  },
  {
    id: '2',
    name: '儿童百天纪念摄影',
    image: 'https://images.unsplash.com/photo-1612103198005-b238154f4590',
    price: 1299,
    originalPrice: 1699,
    sales: 89,
    category: '儿童'
  },
  {
    id: '3',
    name: '毕业季个人写真套餐',
    image: 'https://images.unsplash.com/photo-1541534401786-2077eed87a74',
    price: 699,
    originalPrice: 799,
    sales: 203,
    category: '写真'
  },
  {
    id: '4',
    name: '森系情侣写真套餐',
    image: 'https://images.unsplash.com/photo-1519011985187-444d62641929',
    price: 1299,
    originalPrice: 1599,
    sales: 176,
    category: '写真'
  }
]

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [hotProducts] = useState(products)
  const [newProducts] = useState(products.slice(0, 2))

  useLoad(() => {
    console.log('Home page loaded.')
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false)
    }, 500)
  })

  // 使用loading变量来展示加载状态
  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }

  // 渲染函数，不需要类型注解
  const renderBanners = () => {
    return banners.map((banner) => (
      <SwiperItem key={banner.id}>
        <Image 
          className='banner-image' 
          src={banner.image} 
          mode='aspectFill'
        />
      </SwiperItem>
    ))
  }

  const renderCategories = () => {
    return categories.map((category) => (
      <View key={category.id} className='category-item'>
        <Text className='category-icon'>{category.icon}</Text>
        <Text className='category-name'>{category.name}</Text>
      </View>
    ))
  }

  const renderProducts = (productList) => {
    return productList.map(product => (
      <View key={product.id} className='product-item'>
        <ProductCard 
          id={product.id}
          name={product.name}
          image={product.image}
          price={product.price}
          originalPrice={product.originalPrice}
          sales={product.sales}
          category={product.category}
        />
      </View>
    ))
  }

  return (
    <View className='home-page'>
      {/* 顶部banner */}
      <Swiper
        className='banner-swiper'
        indicatorColor='#999'
        indicatorActiveColor='#fff'
        circular
        indicatorDots
        autoplay
      >
        {renderBanners()}
      </Swiper>
      
      {/* 分类导航 */}
      <View className='category-section'>
        <ScrollView 
          className='category-scroll' 
          scrollX 
          enableFlex
          showScrollbar={false}
        >
          {renderCategories()}
        </ScrollView>
      </View>
      
      {/* 热门套餐 */}
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>热门套餐</Text>
          <Text className='section-more'>查看更多</Text>
        </View>
        <View className='product-grid'>
          {renderProducts(hotProducts)}
        </View>
      </View>
      
      {/* 最新活动 */}
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>最新活动</Text>
          <Text className='section-more'>全部活动</Text>
        </View>
        <View className='activity-banner'>
          <Image 
            className='activity-image' 
            src='https://images.unsplash.com/photo-1526047932273-341f2a7631f9' 
            mode='aspectFill'
          />
          <View className='activity-info'>
            <Text className='activity-title'>夏日特惠活动</Text>
            <Text className='activity-desc'>全场套餐满2000减200</Text>
            <View className='activity-btn'>立即查看</View>
          </View>
        </View>
      </View>
      
      {/* 新品上架 */}
      <View className='section'>
        <View className='section-header'>
          <Text className='section-title'>新品上架</Text>
          <Text className='section-more'>更多新品</Text>
        </View>
        <View className='new-products'>
          {renderProducts(newProducts)}
        </View>
      </View>
    </View>
  )
}
