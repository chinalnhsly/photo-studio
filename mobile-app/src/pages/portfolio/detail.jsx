import React, { useState, useEffect } from 'react'
import { View, Text, Image, Grid, GridItem } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import ImageViewer from '@/components/ImageViewer'
import './detail.scss'

const PortfolioDetailPage = () => {
  const router = useRouter()
  const { id } = router.params
  
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewerImages, setViewerImages] = useState([])
  const [viewerVisible, setViewerVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const mockPhotos = Array(12).fill(null).map((_, i) => ({
        id: `photo-${i}`,
        url: `https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg?w=1000&h=${700 + i * 50}`,
        width: 1000,
        height: 700 + i * 50,
        description: `照片描述 ${i + 1}`
      }))
      
      setAlbum({
        id,
        title: '海边婚纱照',
        coverImage: 'https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043964.jpg',
        description: '蓝天白云，海边浪漫，记录下您爱的瞬间。专业摄影师拍摄，全程一对一指导，提供数码照片和精修相册。',
        photographer: '王摄影师',
        date: '2023-05-20',
        photoCount: mockPhotos.length,
        viewCount: 1256,
        photos: mockPhotos,
        category: '婚纱摄影',
        tags: ['海景', '夕阳', '婚纱', '沙滩']
      })
      
      // 准备图片查看器数据
      setViewerImages(mockPhotos.map(photo => ({
        url: photo.url,
        ...photo
      })))
      
      setLoading(false)
    }, 800)
  }, [id])
  
  // 点击查看大图
  const handlePreviewImage = (index) => {
    setCurrentImageIndex(index)
    setViewerVisible(true)
  }
  
  // 分享页面
  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
  
  // 预约拍摄
  const handleBooking = () => {
    Taro.navigateTo({
      url: '/pages/booking/index'
    })
  }
  
  if (loading) {
    return (
      <View className='loading'>
        <Text>加载中...</Text>
      </View>
    )
  }
  
  if (!album) {
    return (
      <View className='error'>
        <Text>无法加载作品详情</Text>
      </View>
    )
  }
  
  return (
    <View className='portfolio-detail-page'>
      <View className='header'>
        <Image className='cover' src={album.coverImage} mode='aspectFill' />
        <View className='info-overlay'>
          <View className='title-row'>
            <Text className='title'>{album.title}</Text>
            <View className='share-btn' onClick={handleShare}>
              分享
            </View>
          </View>
          <View className='meta-row'>
            <Text className='photographer'>{album.photographer}</Text>
            <Text className='date'>{album.date}</Text>
          </View>
        </View>
      </View>
      
      <View className='content'>
        <View className='section description'>
          <Text className='desc-text'>{album.description}</Text>
          <View className='tags'>
            {album.tags.map(tag => (
              <Text key={tag} className='tag'>{tag}</Text>
            ))}
          </View>
        </View>
        
        <View className='section photos'>
          <View className='section-header'>
            <Text className='section-title'>照片集({album.photoCount})</Text>
            <Text className='view-count'>{album.viewCount} 次浏览</Text>
          </View>
          
          <View className='photo-grid'>
            {album.photos.map((photo, index) => (
              <View 
                key={photo.id} 
                className='photo-item'
                onClick={() => handlePreviewImage(index)}
              >
                <Image 
                  className='photo' 
                  src={photo.url} 
                  mode='aspectFill'
                  lazyLoad
                />
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* 图片预览组件 */}
      <ImageViewer 
        images={viewerImages}
        initialIndex={currentImageIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        onIndexChange={setCurrentImageIndex}
      />
      
      {/* 底部预约按钮 */}
      <View className='booking-bar'>
        <Button className='booking-btn' onClick={handleBooking}>
          预约拍摄
        </Button>
      </View>
    </View>
  )
}

export default PortfolioDetailPage
