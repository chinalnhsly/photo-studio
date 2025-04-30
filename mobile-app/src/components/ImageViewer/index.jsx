import React, { useState, useEffect } from 'react'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

/**
 * 图片预览组件
 * @param {Object} props
 * @param {Array<{url: string, [key: string]: any}>} props.images - 图片列表
 * @param {number} props.initialIndex - 初始显示的图片索引
 * @param {boolean} props.visible - 是否可见
 * @param {Function} props.onClose - 关闭回调
 * @param {Function} props.onIndexChange - 索引变化回调
 */
const ImageViewer = ({ 
  images = [], 
  initialIndex = 0, 
  visible = false, 
  onClose = () => {}, 
  onIndexChange = () => {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  
  // 更新当前索引
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, visible])
  
  // 处理轮播图变化
  const handleChange = (e) => {
    const index = e.detail.current
    setCurrentIndex(index)
    onIndexChange(index)
  }
  
  // 保存图片到相册
  const handleSaveImage = async () => {
    const currentImage = images[currentIndex];
    if (!currentImage || !currentImage.url) return;
    
    try {
      Taro.showLoading({ title: '保存中...' });
      
      // 获取本地临时路径
      const { tempFilePath } = await Taro.downloadFile({
        url: currentImage.url
      });
      
      // 保存到相册
      await Taro.saveImageToPhotosAlbum({
        filePath: tempFilePath
      });
      
      Taro.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (error) {
      console.error('保存图片失败:', error);
      
      if (error.errMsg.includes('auth deny')) {
        Taro.showModal({
          title: '提示',
          content: '需要您授权保存图片到相册',
          showCancel: true,
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting();
            }
          }
        });
      } else {
        Taro.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    } finally {
      Taro.hideLoading();
    }
  }
  
  if (!visible) return null;
  
  return (
    <View className='image-viewer'>
      <View className='viewer-header'>
        <Text className='counter'>{currentIndex + 1}/{images.length}</Text>
        <View className='close-btn' onClick={onClose}>✕</View>
      </View>
      
      <Swiper
        className='viewer-swiper'
        current={currentIndex}
        onChange={handleChange}
        indicatorDots={false}
        circular
      >
        {images.map((image, index) => (
          <SwiperItem key={`image-${index}`} className='swiper-item'>
            <View className='zoom-container'>
              <Image
                className='zoom-image'
                src={image.url}
                mode='aspectFit'
                showMenuByLongpress
              />
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      
      <View className='viewer-footer'>
        <View className='action-btn save-btn' onClick={handleSaveImage}>
          保存
        </View>
      </View>
    </View>
  );
};

export default ImageViewer;
