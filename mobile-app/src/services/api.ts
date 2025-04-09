import Taro from '@tarojs/taro'

// 服务器基础地址
const BASE_URL = 'https://api.photostudio-example.com/v1'

// 接口请求超时时间
const TIMEOUT = 10000

// 通用请求方法
export const request = <T = any>(options: Taro.request.Option): Promise<T> => {
  return new Promise((resolve, reject) => {
    const token = Taro.getStorageSync('token')
    const header = {
      'Content-Type': 'application/json',
      ...options.header,
    }

    // 如果已登录，添加token
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    Taro.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      header,
      timeout: TIMEOUT,
      success: (res) => {
        // 根据业务状态码判断请求是否成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // token失效，需要重新登录
          Taro.removeStorageSync('token')
          Taro.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          // 跳转到登录页
          setTimeout(() => {
            Taro.navigateTo({ url: '/pages/user/login/index' })
          }, 1500)
          reject(new Error('登录已过期'))
        } else {
          Taro.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          })
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: (error) => {
        // 修复：使用参数名error代替err，并记录错误信息
        console.error('请求失败:', error);
        
        // 使用error中的信息丰富错误提示
        const errorMsg = error.errMsg ? `网络异常: ${error.errMsg}` : '网络异常，请稍后重试';
        
        Taro.showToast({
          title: errorMsg,
          icon: 'none'
        })
        reject(new Error(errorMsg))
      }
    })
  })
}

/**
 * 产品相关API
 */
export const productApi = {
  // 获取产品列表
  getProductList: (params: { page: number, pageSize: number, category?: string }) => 
    request<{
      list: any[],
      total: number,
      page: number,
      pageSize: number
    }>({
      url: '/products',
      method: 'GET',
      data: params
    }),
    
  // 获取产品详情
  getProductDetail: (id: string) => 
    request<{
      id: string,
      name: string,
      price: number,
      originalPrice: number,
      images: string[],
      description: string,
      services: string[],
      availableDates: any[]
    }>({
      url: `/products/${id}`,
      method: 'GET'
    }),
    
  // 获取热门产品
  getHotProducts: (limit: number = 4) => 
    request<any[]>({
      url: '/products/hot',
      method: 'GET',
      data: { limit }
    })
}

/**
 * 用户相关API
 */
export const userApi = {
  // 登录
  login: (data: { username: string, password: string }) => 
    request<{ token: string, user: any }>({
      url: '/auth/login',
      method: 'POST',
      data
    }),
    
  // 注册
  register: (data: { username: string, password: string, mobile: string }) => 
    request<{ token: string, user: any }>({
      url: '/auth/register',
      method: 'POST',
      data
    }),
    
  // 获取用户信息
  getUserInfo: () => 
    request<any>({
      url: '/user/info',
      method: 'GET'
    })
}

/**
 * 订单相关API
 */
export const orderApi = {
  // 创建订单
  createOrder: (data: { 
    productId: string, 
    date: string,
    timeSlot: string,
    contactName: string,
    contactPhone: string,
    remark?: string 
  }) => 
    request<{ orderId: string }>({
      url: '/orders',
      method: 'POST',
      data
    }),
    
  // 获取订单列表
  getOrderList: (params: { status?: string, page: number, pageSize: number }) => 
    request<{
      list: any[],
      total: number,
      page: number,
      pageSize: number
    }>({
      url: '/orders',
      method: 'GET',
      data: params
    }),
    
  // 获取订单详情
  getOrderDetail: (id: string) => 
    request<any>({
      url: `/orders/${id}`,
      method: 'GET'
    }),
    
  // 取消订单
  cancelOrder: (id: string, reason: string) => 
    request<any>({
      url: `/orders/${id}/cancel`,
      method: 'POST',
      data: { reason }
    }),
    
  // 支付订单
  payOrder: (id: string) => 
    request<{ payParams: any }>({
      url: `/orders/${id}/pay`,
      method: 'POST'
    })
}
