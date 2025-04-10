import Taro from '@tarojs/taro'

// 基础配置
const BASE_URL = 'https://api.example.com/v1'

// 封装请求函数
export const request = <T = any>(options: Taro.request.Option): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = Taro.getStorageSync('token')
    
    const defaultOptions: Taro.request.Option = {
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.header
      },
      success: (res) => {
        // 状态码2xx表示成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // 未授权，清除token并跳转到登录页
          Taro.removeStorageSync('token')
          Taro.navigateTo({ url: '/pages/login/index' })
          reject(new Error('未授权，请重新登录'))
        } else {
          // 其他错误
          Taro.showToast({
            title: `请求失败: ${res.statusCode}`,
            icon: 'none'
          })
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '网络异常，请稍后再试',
          icon: 'none'
        })
        reject(err)
      }
    }

    Taro.request(defaultOptions)
  })
}

// API模块 - 商品相关
export const productApi = {
  // 获取商品列表
  getProducts: (params?: { 
    page?: number, 
    pageSize?: number, 
    category?: string 
  }) => {
    return request<{
      list: Product[],
      total: number
    }>({
      url: '/products',
      data: params
    })
  },
  
  // 获取商品详情
  getProductDetail: (id: string) => {
    return request<Product>({
      url: `/products/${id}`
    })
  },
  
  // 获取商品分类
  getCategories: () => {
    return request<Category[]>({
      url: '/categories'
    })
  }
}

// API模块 - 预约相关
export const bookingApi = {
  // 获取可预约时间段
  getAvailableSlots: (params: { 
    productId: string, 
    date: string 
  }) => {
    return request<TimeSlot[]>({
      url: '/booking/slots',
      data: params
    })
  },
  
  // 创建预约
  createBooking: (data: {
    productId: string,
    date: string,
    timeSlot: string,
    contactName: string,
    contactPhone: string
  }) => {
    return request<{ bookingId: string }>({
      url: '/booking/create',
      method: 'POST',
      data
    })
  }
}

// 类型定义
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  description: string
  services: string[]
  category: string
  sales: number
  availableDates?: {
    date: string
    slots: string[]
  }[]
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
}
