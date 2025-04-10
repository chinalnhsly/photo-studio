#!/bin/bash

echo "=== 修复缺失文件和SCSS语法错误 ==="

cd /home/liyong/photostudio/mobile-app

# 1. 创建缺失的目录
mkdir -p src/pages/search
mkdir -p src/pages/portfolio/detail
mkdir -p src/pages/portfolio
mkdir -p src/pages/user/bookings

# 2. 创建缺失的页面文件

# 搜索页面
cat > src/pages/search/index.jsx << 'EOF'
import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  const handleSearch = () => {
    if (!keyword.trim()) return
    
    setSearching(true)
    
    // 模拟搜索请求
    setTimeout(() => {
      // 模拟数据
      const results = Array(5).fill().map((_, i) => ({
        id: `prod-${i}`,
        name: `${keyword}相关商品 ${i+1}`,
        price: Math.floor(Math.random() * 1000) + 100,
      }))
      
      setSearchResults(results)
      setSearching(false)
    }, 800)
  }

  return (
    <View className='search-page'>
      <View className='search-bar'>
        <Input
          className='search-input'
          value={keyword}
          onInput={e => setKeyword(e.detail.value)}
          placeholder='搜索商品'
          confirmType='search'
          onConfirm={handleSearch}
        />
        <View className='search-btn' onClick={handleSearch}>搜索</View>
      </View>
      
      <View className='search-results'>
        {searching ? (
          <View className='loading'>正在搜索...</View>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <View className='result-list'>
                {searchResults.map(item => (
                  <View 
                    key={item.id}
                    className='result-item'
                    onClick={() => Taro.navigateTo({
                      url: `/pages/product/detail/index?id=${item.id}`
                    })}
                  >
                    <Text className='item-name'>{item.name}</Text>
                    <Text className='item-price'>¥{item.price}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className='empty-result'>
                {keyword ? '没有找到相关商品' : '请输入关键词搜索'}
              </View>
            )}
          </>
        )}
      </View>
    </View>
  )
}

export default SearchPage
EOF

cat > src/pages/search/index.scss << 'EOF'
.search-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  
  .search-bar {
    display: flex;
    background-color: #ffffff;
    border-radius: 40px;
    padding: 10px 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .search-input {
      flex: 1;
      height: 40px;
      font-size: 28px;
      border: none;
      outline: none;
    }
    
    .search-btn {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #ff6b81;
      color: white;
      font-size: 26px;
      border-radius: 20px;
    }
  }
  
  .search-results {
    margin-top: 20px;
    
    .loading {
      text-align: center;
      color: #999999;
      padding: 40px 0;
      font-size: 28px;
    }
    
    .result-list {
      .result-item {
        background-color: #ffffff;
        padding: 20px;
        margin-bottom: 15px;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .item-name {
          font-size: 28px;
          color: #333333;
        }
        
        .item-price {
          font-size: 30px;
          color: #ff6b81;
          font-weight: bold;
        }
      }
    }
    
    .empty-result {
      text-align: center;
      color: #999999;
      padding: 80px 0;
      font-size: 28px;
    }
  }
}
EOF

# 作品集页面
cat > src/pages/portfolio/index.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟作品数据
const mockAlbums = [
  {
    id: '1',
    title: '婚纱照',
    cover: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
    photoCount: 28,
    tags: ['婚纱', '海边', '旅拍']
  },
  {
    id: '2',
    title: '日系写真',
    cover: 'https://img.freepik.com/free-photo/smiley-woman-posing-outdoors_23-2148895799.jpg',
    photoCount: 35,
    tags: ['写真', '日系', '小清新']
  },
  {
    id: '3',
    title: '古装主题',
    cover: 'https://img.freepik.com/premium-photo/girl-traditional-chinese-clothes-hanfu-dress-standing-temple_410516-95.jpg',
    photoCount: 42,
    tags: ['古风', '汉服', '传统']
  }
]

// 模拟分类数据
const categories = [
  { id: 'all', name: '全部' },
  { id: 'wedding', name: '婚纱' },
  { id: 'portrait', name: '写真' },
  { id: 'family', name: '亲子' }
]

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setAlbums(mockAlbums)
      setLoading(false)
    }, 500)
  }, [])
  
  const handleAlbumClick = (albumId) => {
    Taro.navigateTo({
      url: `/pages/portfolio/detail?id=${albumId}`
    })
  }

  return (
    <View className='portfolio-page'>
      <ScrollView
        className='category-scroll'
        scrollX
        showScrollbar={false}
      >
        {categories.map(category => (
          <View
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </View>
        ))}
      </ScrollView>
      
      <View className='album-list'>
        {loading ? (
          <View className='loading'>加载中...</View>
        ) : (
          <View className='album-grid'>
            {albums.map(album => (
              <View 
                key={album.id} 
                className='album-item'
                onClick={() => handleAlbumClick(album.id)}
              >
                <Image className='album-cover' src={album.cover} mode='aspectFill' />
                <View className='album-info'>
                  <Text className='album-title'>{album.title}</Text>
                  <Text className='album-count'>{album.photoCount}张照片</Text>
                </View>
                <View className='album-tags'>
                  {album.tags.map((tag, index) => (
                    <Text key={index} className='tag'>{tag}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default PortfolioPage
EOF

cat > src/pages/portfolio/index.scss << 'EOF'
.portfolio-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  
  .category-scroll {
    white-space: nowrap;
    background-color: #ffffff;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    
    .category-item {
      display: inline-block;
      margin: 0 20px;
      padding: 8px 12px;
      font-size: 28px;
      color: #666;
      position: relative;
      
      &.active {
        color: #ff6b81;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -15px;
          height: 3px;
          background-color: #ff6b81;
        }
      }
    }
  }
  
  .album-list {
    padding: 20px;
    
    .album-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      
      .album-item {
        width: calc(50% - 10px);
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        .album-cover {
          width: 100%;
          height: 300px;
          background-color: #f0f0f0;
        }
        
        .album-info {
          padding: 15px;
          
          .album-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            display: block;
          }
          
          .album-count {
            font-size: 24px;
            color: #999;
          }
        }
        
        .album-tags {
          display: flex;
          flex-wrap: wrap;
          padding: 0 15px 15px;
          
          .tag {
            font-size: 20px;
            color: #ff6b81;
            background-color: rgba(255, 107, 129, 0.1);
            padding: 4px 10px;
            border-radius: 20px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
    
    .loading {
      text-align: center;
      padding: 40px 0;
      color: #999;
      font-size: 28px;
    }
  }
}
EOF

# 作品集详情页
cat > src/pages/portfolio/detail.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './detail.scss'

const PortfolioDetailPage = () => {
  const router = useRouter()
  const { id } = router.params
  
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)
  
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setAlbum({
        id,
        title: '海边婚纱照',
        coverImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
        description: '蓝天白云，海边浪漫，记录下您爱的瞬间',
        photographer: '王摄影师',
        date: '2023-05-20',
        photoCount: 28,
        viewCount: 1256,
        photos: [
          { id: 'p1', url: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg' },
          { id: 'p2', url: 'https://img.freepik.com/free-photo/beautiful-bride-groom-having-their-wedding-day_23-2149104681.jpg' },
          { id: 'p3', url: 'https://img.freepik.com/free-photo/beautiful-bride-groom-beach_1157-17205.jpg' }
        ]
      })
      setLoading(false)
    }, 600)
  }, [id])
  
  if (loading) {
    return <View className='loading'>加载中...</View>
  }
  
  if (!album) {
    return <View className='error'>无法加载作品详情</View>
  }
  
  return (
    <View className='portfolio-detail-page'>
      <View className='header'>
        <Image className='cover' src={album.coverImage} mode='aspectFill' />
        <View className='info-overlay'>
          <Text className='title'>{album.title}</Text>
          <Text className='date'>{album.date}</Text>
        </View>
      </View>
      
      <View className='content'>
        <View className='section photographer'>
          <Text className='photographer-name'>{album.photographer}</Text>
          <Text className='view-count'>{album.viewCount} 次浏览</Text>
        </View>
        
        <View className='section description'>
          <Text>{album.description}</Text>
        </View>
        
        <View className='section photos'>
          <Text className='section-title'>照片集({album.photoCount})</Text>
          <View className='photo-grid'>
            {album.photos.map((photo, index) => (
              <View
                key={photo.id}
                className='photo-item'
                onClick={() => {
                  setCurrentIndex(index)
                  setShowFullscreen(true)
                }}
              >
                <Image className='photo' src={photo.url} mode='aspectFill' />
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {showFullscreen && (
        <View className='fullscreen-viewer'>
          <View className='close-btn' onClick={() => setShowFullscreen(false)}>✕</View>
          <Swiper 
            className='fullscreen-swiper' 
            current={currentIndex}
            onChange={e => setCurrentIndex(e.detail.current)}
          >
            {album.photos.map(photo => (
              <SwiperItem key={photo.id} className='fullscreen-item'>
                <Image className='fullscreen-image' src={photo.url} mode='aspectFit' />
              </SwiperItem>
            ))}
          </Swiper>
          <View className='counter'>{currentIndex + 1}/{album.photos.length}</View>
        </View>
      )}
    </View>
  )
}

export default PortfolioDetailPage
EOF

cat > src/pages/portfolio/detail.scss << 'EOF'
.portfolio-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  
  .header {
    position: relative;
    height: 400px;
    
    .cover {
      width: 100%;
      height: 100%;
    }
    
    .info-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      
      .title {
        color: white;
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
      }
      
      .date {
        color: rgba(255,255,255,0.8);
        font-size: 24px;
      }
    }
  }
  
  .content {
    padding: 20px;
    
    .section {
      margin-bottom: 30px;
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      
      &.photographer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .photographer-name {
          font-size: 28px;
          font-weight: bold;
        }
        
        .view-count {
          font-size: 24px;
          color: #999;
        }
      }
      
      &.description {
        font-size: 28px;
        line-height: 1.6;
        color: #333;
      }
      
      &.photos {
        .section-title {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 20px;
          display: block;
        }
        
        .photo-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          
          .photo-item {
            width: calc(33.33% - 7px);
            
            .photo {
              width: 100%;
              height: 200px;
              border-radius: 5px;
            }
          }
        }
      }
    }
  }
  
  .fullscreen-viewer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    z-index: 1000;
    
    .close-btn {
      position: absolute;
      top: 30px;
      right: 30px;
      color: white;
      font-size: 40px;
      z-index: 1001;
    }
    
    .fullscreen-swiper {
      height: 100vh;
      
      .fullscreen-item {
        display: flex;
        align-items: center;
        justify-content: center;
        
        .fullscreen-image {
          width: 100%;
          height: 100%;
        }
      }
    }
    
    .counter {
      position: absolute;
      bottom: 30px;
      left: 0;
      right: 0;
      text-align: center;
      color: white;
      font-size: 28px;
    }
  }
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #999;
  font-size: 30px;
}
EOF

# 用户预约页面
cat > src/pages/user/bookings/index.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 模拟预约数据
const mockBookings = [
  {
    id: 'booking1',
    productName: '婚纱照套餐',
    status: 'completed',
    bookingDate: '2023-06-15',
    timeSlot: '上午 9:00-12:00',
    price: 3999,
    coverImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg'
  },
  {
    id: 'booking2',
    productName: '情侣写真',
    status: 'upcoming',
    bookingDate: '2023-08-20',
    timeSlot: '下午 14:00-16:00',
    price: 1599,
    coverImage: 'https://img.freepik.com/free-photo/smiley-woman-posing-outdoors_23-2148895799.jpg'
  },
  {
    id: 'booking3',
    productName: '儿童写真',
    status: 'cancelled',
    bookingDate: '2023-07-10',
    timeSlot: '上午 10:00-11:30',
    price: 999,
    coverImage: 'https://img.freepik.com/free-photo/full-shot-kid-taking-photos_23-2149029007.jpg'
  }
]

// 状态标签颜色和文本
const statusConfig = {
  upcoming: { text: '待拍摄', color: '#ff9f43' },
  completed: { text: '已完成', color: '#2ecc71' },
  cancelled: { text: '已取消', color: '#999999' }
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  
  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 500)
  }, [])
  
  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab)
  
  const handleBookingClick = (bookingId) => {
    Taro.navigateTo({
      url: `/pages/user/bookings/detail?id=${bookingId}`
    })
  }

  return (
    <View className='bookings-page'>
      <View className='tabs'>
        <View 
          className={`tab-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部
        </View>
        <View 
          className={`tab-item ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          待拍摄
        </View>
        <View 
          className={`tab-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          已完成
        </View>
        <View 
          className={`tab-item ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          已取消
        </View>
      </View>
      
      {loading ? (
        <View className='loading'>加载中...</View>
      ) : (
        <View className='booking-list'>
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <View 
                key={booking.id} 
                className='booking-card'
                onClick={() => handleBookingClick(booking.id)}
              >
                <Image className='booking-image' src={booking.coverImage} mode='aspectFill' />
                <View className='booking-info'>
                  <View className='booking-header'>
                    <Text className='booking-name'>{booking.productName}</Text>
                    <Text 
                      className='booking-status'
                      style={{color: statusConfig[booking.status].color}}
                    >
                      {statusConfig[booking.status].text}
                    </Text>
                  </View>
                  <View className='booking-details'>
                    <Text className='booking-date'>
                      预约日期：{booking.bookingDate}
                    </Text>
                    <Text className='booking-time'>
                      预约时间：{booking.timeSlot}
                    </Text>
                    <Text className='booking-price'>
                      ¥{booking.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className='empty-list'>
              <Image 
                className='empty-icon'
                src='https://img.icons8.com/clouds/100/000000/calendar.png'
              />
              <Text className='empty-text'>暂无预约记录</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default BookingsPage
EOF

cat > src/pages/user/bookings/index.scss << 'EOF'
.bookings-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  
  .tabs {
    display: flex;
    background-color: #fff;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    
    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 28px;
      color: #666;
      position: relative;
      
      &.active {
        color: #ff6b81;
        font-weight: bold;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background-color: #ff6b81;
        }
      }
    }
  }
  
  .booking-list {
    padding: 20px;
    
    .booking-card {
      display: flex;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      
      .booking-image {
        width: 160px;
        height: 160px;
        flex-shrink: 0;
      }
      
      .booking-info {
        flex: 1;
        padding: 15px;
        display: flex;
        flex-direction: column;
        
        .booking-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          
          .booking-name {
            font-size: 30px;
            font-weight: bold;
            color: #333;
          }
          
          .booking-status {
            font-size: 24px;
          }
        }
        
        .booking-details {
          .booking-date, .booking-time {
            font-size: 26px;
            color: #666;
            margin-bottom: 8px;
            display: block;
          }
          
          .booking-price {
            font-size: 30px;
            font-weight: bold;
            color: #ff6b81;
            margin-top: 10px;
            display: block;
          }
        }
      }
    }
    
    .empty-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 0;
      
      .empty-icon {
        width: 150px;
        height: 150px;
        margin-bottom: 20px;
      }
      
      .empty-text {
        color: #999;
        font-size: 28px;
      }
    }
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: #999;
    font-size: 28px;
  }
}
EOF

# 3. 修复 payment/index.scss 文件中的语法错误
# 查找并修复第57行缺少大括号的问题
cat > src/pages/payment/index.scss.fixed << 'EOF'
.payment-page {
  min-height: 100vh;
  background-color: var(--background-color, #f8f9fa);
  padding-bottom: 150px; // 为底部支付按钮留出空间
  
  .order-card, .payment-card, .payment-method-card {
    margin: 20px;
    background-color: var(--white, #ffffff);
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--shadow, 0 2px 12px 0 rgba(0, 0, 0, 0.05));
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .card-title {
        font-size: 30px;
        font-weight: bold;
        color: var(--text-color, #333333);
      }
      
      .order-number {
        font-size: 24px;
        color: var(--light-text, #999999);
      }
    }
  }
  
  .product-info {
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 20px;
    
    .product-image {
      width: 140px;
      height: 140px;
      border-radius: 8px;
      margin-right: 20px;
    }
    
    .product-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      
      .product-name {
        font-size: 28px;
        color: var(--text-color, #333333);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      
      .product-price-row {
        display: flex;
        align-items: baseline;
        
        .price {
          font-size: 32px;
          font-weight: bold;
          color: var(--primary-color, #ff6b81);
          margin-right: 10px;
        }
        
        .original-price {
          font-size: 24px;
          color: var(--light-text, #999999);
          text-decoration: line-through;
        }
      }
    }
  }
  
  .booking-info {
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .info-label {
        color: var(--light-text, #999999);
        font-size: 28px;
      }
      
      .info-value {
        color: var(--text-color, #333333);
        font-size: 28px;
      }
    }
  }
  
  .price-detail {
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-size: 28px;
        color: var(--light-text, #999999);
      }
      
      .value {
        font-size: 28px;
        color: var(--text-color, #333333);
      }
      
      &.discount {
        .value {
          color: var(--primary-color, #ff6b81);
        }
      }
      
      &.total {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px dashed #f0f0f0;
        
        .label, .value {
          font-size: 32px;
          font-weight: bold;
          color: var(--text-color, #333333);
        }
        
        .value {
          color: var(--primary-color, #ff6b81);
        }
      }
    }
  }
  
  .method-list {
    .method-item {
      display: flex;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .method-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        
        .icon-box {
          font-size: 24px;
          font-weight: bold;
        }
        
        &.wechat {
          background-color: #07c160;
          color: white;
        }
        
        &.alipay {
          background-color: #00a0e9;
          color: white;
        }
      }
      
      .method-name {
        flex: 1;
        font-size: 28px;
        color: var(--text-color, #333333);
      }
      
      .checked-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color, #ff6b81);
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  
  .payment-action {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    
    .total-amount {
      flex: 1;
      display: flex;
      align-items: baseline;
      
      .label {
        font-size: 28px;
        color: var(--text-color, #333333);
      }
      
      .amount {
        font-size: 38px;
        font-weight: bold;
        color: var(--primary-color, #ff6b81);
      }
    }
    
    .pay-btn {
      width: 240px;
      height: 80px;
      line-height: 80px;
      background-color: var(--primary-color, #ff6b81);
      color: white;
      font-size: 30px;
      font-weight: bold;
      border-radius: 40px;
      
      &::after {
        border: none;
      }
    }
  }
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  
  .back-btn {
    margin-top: 30px;
    background-color: var(--primary-color, #ff6b81);
    color: white;
    border-radius: 40px;
    width: 300px;
    height: 80px;
    line-height: 80px;
    font-size: 28px;
    
    &::after {
      border: none;
    }
  }
}
EOF

# 替换有问题的文件
mv src/pages/payment/index.scss.fixed src/pages/payment/index.scss

# 4. 更新 app.config.js 确保所有页面都注册
if [ -f "src/app.config.js" ]; then
  cat > src/app.config.js << 'EOF'
export default {
  pages: [
    'pages/home/index',
    'pages/product/detail/index',
    'pages/category/index',
    'pages/user/index',
    'pages/booking/index',
    'pages/booking/success',
    'pages/product/list/index',
    'pages/user/bookings/index',
    'pages/search/index',
    'pages/user/bookings/detail',
    'pages/user/favorites/index',
    'pages/marketing/coupons',
    'pages/payment/index',
    'pages/payment/success',
    'pages/portfolio/index',
    'pages/portfolio/detail'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '影楼商城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#ff6b81",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "./assets/icons/home.png",
        selectedIconPath: "./assets/icons/home-active.png"
      },
      {
        pagePath: "pages/category/index",
        text: "分类",
        iconPath: "./assets/icons/category.png",
        selectedIconPath: "./assets/icons/category-active.png"
      },
      {
        pagePath: "pages/portfolio/index",
        text: "作品集",
        iconPath: "./assets/icons/portfolio.png",
        selectedIconPath: "./assets/icons/portfolio-active.png"
      },
      {
        pagePath: "pages/user/index",
        text: "我的",
        iconPath: "./assets/icons/user.png",
        selectedIconPath: "./assets/icons/user-active.png"
      }
    ]
  }
}
EOF
fi

# 5. 清理缓存
rm -rf .temp
rm -rf .cache
rm -rf dist

echo "=== 修复完成 ==="
echo "缺失的页面文件已创建，SCSS语法错误已修复"
echo "现在可以重新运行: yarn dev:weapp"
