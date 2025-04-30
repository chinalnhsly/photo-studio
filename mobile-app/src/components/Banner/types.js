
import type { ViewProps } from '@tarojs/components/types/View'
import type { SwiperProps } from '@tarojs/components/types/Swiper'

export interface BannerImage {
  id: number | string
  url: string
}

export interface BannerProps extends ViewProps {
  imageList?: BannerImage[]
  className?: string
  swiperProps?: Partial<SwiperProps>
}
