import type { BaseProduct } from '@/types/product'

export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: {
    id: number
    name: string
    icon?: string
  }
  tags: string[]
}

export interface ProductCardProps {
  data: BaseProduct
  onClick?: () => void  // 修改为无参数的回调函数类型
}
