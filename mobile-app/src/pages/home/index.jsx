import React, { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const HomePage = () => {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [recommendProducts, setRecommendProducts] = useState([])
  const [hotProducts, setHotProducts] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  // 模拟获取首页数据
  const fetchHomeData = async () => {
    setLoading(true)

    try {
      // 模拟API请求
      setTimeout(() => {
        // 轮播图数据
        const bannersData = [
          {
            id: 1,
            image: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
            title: '夏日特惠婚纱照',
            url: '/pages/product/detail/index?id=1'
          },
          {
            id: 2,
            image: 'https://img.freepik.com/free-photo/beautiful-couple-having-their-wedding-beach_23-2149043939.jpg',
            title: '海景婚纱摄影',
            url: '/pages/product/detail/index?id=2'
          },
          {
            id: 3,
            image: 'https://img.freepik.com/free-photo/beautiful-girl-stands-near-walll-with-leaves_8353-5377.jpg',
            title: '夏日写真套餐',
            url: '/pages/product/detail/index?id=3'
          }
        ]
        
        // 分类数据
        const categoriesData = [
          {
            id: 'cat1',
            name: '婚纱摄影',
            icon: '👰',
            url: '/pages/product/list/index?categoryId=cat1'
          },
          {
            id: 'cat2',
            name: '写真套餐',
            icon: '📸',
            url: '/pages/product/list/index?categoryId=cat2'
          },
          {
            id: 'cat3',
            name: '全家福',
            icon: '👨‍👩‍👧‍👦',
            url: '/pages/product/list/index?categoryId=cat3'
          },
          {
            id: 'cat4',
            name: '儿童摄影',
            icon: '👶',
            url: '/pages/product/list/index?categoryId=cat4'
          },
          {
            id: 'cat5',
            name: '商业摄影',
            icon: '💼',
            url: '/pages/product/list/index?categoryId=cat5'
          },
          {
            id: 'cat6',
            name: '孕妇照',
            icon: '🤰',
            url: '/pages/product/list/index?categoryId=cat6'
          },
          {
            id: 'cat7',
            name: '宠物摄影',
            icon: '🐶',
            url: '/pages/product/list/index?categoryId=cat7'
          },
          {
            id: 'cat8',
            name: '更多服务',
            icon: '⋯',
            url: '/pages/category/index'
          }
        ]
        
        // 推荐套餐
        const recommendData = [
          {
            id: 'prod1',
            name: '韩式婚纱照豪华套餐',
            image: 'https://img.freepik.com/free-photo/stylish-couple-doing-photoshoot-their-wedding_23-2149083325.jpg',
            price: 4999,
            originalPrice: 6999
          },
          {
            id: 'prod2',
            name: '海边主题写真',
            image: 'https://img.freepik.com/free-photo/beautiful-couple-having-their-wedding-beach_23-2149043937.jpg',
            price: 2999,
            originalPrice: 3999
          },
          {
            id: 'prod3',
            name: '夏季小清新写真',
            image: 'https://img.freepik.com/free-photo/side-view-couple-beach_23-2149163699.jpg',
            price: 1999,
            originalPrice: 2599
          }
        ]
        
        // 热门商品
        const hotData = [
          {
            id: 'hot1',
            name: '情侣写真特惠套餐',
            image: 'https://img.freepik.com/free-photo/loving-couple-posing-beach_23-2149163689.jpg',
            price: 1599,
            sales: 156
          },
          {
            id: 'hot2',
            name: '儿童百天照',
            image: 'https://img.freepik.com/free-photo/baby-lying-basket_1157-16545.jpg',
            price: 999,
            sales: 203
          },
          {
            id: 'hot3',
            name: '商务形象照',
            image: 'https://img.freepik.com/free-photo/businessman-working-laptop_1388-65.jpg',
            price: 699,
            sales: 89
          },
          {
            id: 'hot4',
            name: '全家福定制',
            image: 'https://img.freepik.com/free-photo/portrait-happy-family_1303-9779.jpg',
            price: 1899,
            sales: 112
          }
        ]
        
        // 活动信息
        const activitiesData = [
          {
            id: 'act1',
            title: '限时团购',
            image: 'https://img.freepik.com/free-vector/flat-sale-banner-with-photo_23-2149026968.jpg',
            date: '07.01-07.31',
            description: '多人拼团，享受超低价！情侣写真低至699起',
            url: '/pages/marketing/group-buy/index'
          },
          {
            id: 'act2',
            title: '积分兑换',
            image: 'https://img.freepik.com/free-vector/gradient-sale-background_23-2149050986.jpg',
            date: '长期有效',
            description: '积分好礼等你来兑，签到得积分',
            url: '/pages/marketing/points-mall'
          },
          {
            id: 'act3',
            title: '限时秒杀',
            image: 'https://img.freepik.com/free-vector/flash-sale-background_52683-42188.jpg',
            date: '每日10点',
            description: '超值套餐限时秒杀，低至5折起',
            url: '/pages/marketing/flash-sale'
          }
        ]
        
        setBanners(bannersData)
        setCategories(categoriesData)
        setRecommendProducts(recommendData)
        setHotProducts(hotData)
        setActivities(activitiesData)
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error('获取首页数据失败:', error)
      setLoading(false)
    }
  }

  // 处理轮播图点击
  const handleBannerClick = (url) => {
    Taro.navigateTo({ url })
  }

  // 处理分类点击
  const handleCategoryClick = (url) => {
    Taro.navigateTo({ url })
  }

  // 处理商品点击
  const handleProductClick = (id) => {
    Taro.navigateTo({
      url: `/pages/product/detail/index?id=${id}`
    })
  }

  // 处理活动点击
  const handleActivityClick = (url) => {
    Taro.navigateTo({ url })
  }

  // 处理查看更多
  const handleViewMore = (type) => {
    let url = '/pages/product/list/index'
    if (type === 'recommend') {
      url += '?tag=recommend'
    } else if (type === 'hot') {
      url += '?tag=hot'
    }
    Taro.navigateTo({ url })
  }

  if (loading) {
    return (
      <View className='loading-container'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='home-page'>
      {/* 轮播图 */}
      {banners.length > 0 && (
        <Swiper
          className='banner'
          indicatorColor='#ffffff50'
          indicatorActiveColor='#ffffff'
          circular
          indicatorDots
          autoplay
        >
          {banners.map(banner => (
            <SwiperItem key={banner.id} onClick={() => handleBannerClick(banner.url)}>
              <Image className='banner-image' src={banner.image} mode='aspectFill' />
              <Text className='banner-title'>{banner.title}</Text>
            </SwiperItem>
          ))}
        </Swiper>
      )}

      {/* 分类导航 */}
      <View className='category-section'>
        <ScrollView scrollX className='category-scroll'>
          {categories.map(category => (
            <View 
              key={category.id}
              className='category-item'
              onClick={() => handleCategoryClick(category.url)}
            >
              <View className='category-icon'>{category.icon}</View>
              <Text className='category-name'>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 推荐套餐 */}
      <View className='section recommend-section'>
        <View className='section-header'>
          <Text className='section-title'>热门套餐</Text>
          <Text className='more' onClick={() => handleViewMore('recommend')}>查看更多 〉</Text>
        </View>
        <ScrollView scrollX className='recommend-list'>
          {recommendProducts.map(product => (
            <View 
              key={product.id}
              className='recommend-item'
              onClick={() => handleProductClick(product.id)}
            >
              <Image className='product-image' src={product.image} mode='aspectFill' />
              <Text className='product-name'>{product.name}</Text>
              <View className='product-price-row'>
                <Text className='product-price'>¥{product.price}</Text>
                <Text className='product-original-price'>¥{product.originalPrice}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 促销活动 */}
      <View className='section activity-section'>
        <View className='section-header'>
          <Text className='section-title'>精彩活动</Text>
        </View>
        <View className='activity-list'>
          {activities.map(activity => (
            <View 
              key={activity.id}
              className='activity-item'
              onClick={() => handleActivityClick(activity.url)}
            >
              <Image className='activity-image' src={activity.image} mode='aspectFill' />
              <View className='activity-info'>
                <Text className='activity-title'>{activity.title}</Text>
                <Text className='activity-date'>{activity.date}</Text>
                <Text className='activity-desc'>{activity.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 热门商品 */}
      <View className='section hot-section'>
        <View className='section-header'>
          <Text className='section-title'>热门单品</Text>
          <Text className='more' onClick={() => handleViewMore('hot')}>查看更多 〉</Text>
        </View>
        <View className='hot-grid'>
          {hotProducts.map(product => (
            <View 
              key={product.id}
              className='hot-item'
              onClick={() => handleProductClick(product.id)}
            >
              <Image className='product-image' src={product.image} mode='aspectFill' />
              <View className='product-info'>
                <Text className='product-name'>{product.name}</Text>
                <View className='product-bottom'>
                  <Text className='product-price'>¥{product.price}</Text>
                  <Text className='product-sales'>已售{product.sales}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default HomePage
