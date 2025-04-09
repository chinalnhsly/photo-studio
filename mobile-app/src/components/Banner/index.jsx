import type { ComponentType } from 'react'
import type { FC } from 'react'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import type { BannerProps } from './types'
import './index.scss'

const Banner: FC<BannerProps> = ({ 
  imageList = [], 
  className = '', 
  swiperProps,
  ...viewProps 
}) => {
  const defaultImages = [
    { id: 1, url: 'https://example.com/banner1.jpg' },
    { id: 2, url: 'https://example.com/banner2.jpg' }
  ]

  const images = imageList.length > 0 ? imageList : defaultImages

  return (
    <View className={`banner-container ${className}`} {...viewProps}>
      <Swiper
        className='banner'
        indicatorDots
        autoplay
        circular
        {...swiperProps}
      >
        {images.map(image => (
          <SwiperItem key={image.id}>
            <Image 
              className='banner-image'
              src={image.url} 
              mode='aspectFill'
            />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

export type { BannerProps }
export default Banner as ComponentType<BannerProps>
