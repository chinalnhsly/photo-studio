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
