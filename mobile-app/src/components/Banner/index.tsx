import { View } from '@tarojs/components'
import { Swiper, SwiperItem, Image } from '@tarojs/components'
import type { BannerProps } from './types'
import './index.scss'

const Banner = ({ imageList = [], className = '' }: BannerProps) => {
  const defaultImages = [
    { id: 1, url: 'https://example.com/banner1.jpg' },
    { id: 2, url: 'https://example.com/banner2.jpg' }
  ]

  const images = imageList.length > 0 ? imageList : defaultImages

  return (
    <View className={`banner-container ${className}`}>
      <Swiper
        className='banner'
        indicatorDots
        autoplay
        circular
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
export default Banner
