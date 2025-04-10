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
