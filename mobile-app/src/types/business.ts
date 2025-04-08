// 基础类型定义
export interface BaseCategory {
  id: number
  name: string
  icon?: string
  parentId?: number
  children?: BaseCategory[]
}

// 商品分类
export interface ProductCategory extends BaseCategory {
  type: 'product'
}

// 商品信息
export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: ProductCategory
  tags: string[]
  appointments?: AppointmentSlot[]
}

export interface AppointmentSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  status: 'available' | 'booked' | 'disabled'
  maxQuota: number
  bookedQuota: number
  available: boolean
}

export interface OrderInfo {
  id: number
  productId: number
  appointmentId: number
  userId: number
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
  amount: number
  createTime: string
  paymentTime?: string
}
