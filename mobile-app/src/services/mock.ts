import { Product, Category, TimeSlot } from './api'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: '高级婚纱摄影套餐',
    price: 3999,
    originalPrice: 5999,
    images: [
      'https://images.unsplash.com/photo-1550005809-91ad75fb315f',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8',
      'https://images.unsplash.com/photo-1507217633297-c9815ce2e9f3'
    ],
    description: '本套餐包含：\n1. 专业摄影师全程跟拍\n2. 多组场景任选\n3. 30张精修照片\n4. 赠送精美相册一本\n5. 赠送电子相册\n6. 婚纱礼服3套任选',
    services: ['免费试纱', '赠送精美相册', '赠送化妆服务', '提供礼服选择'],
    category: '婚纱',
    sales: 156,
    availableDates: [
      { date: '2023-06-20', slots: ['上午', '下午'] },
      { date: '2023-06-21', slots: ['上午'] },
      { date: '2023-06-22', slots: ['下午'] },
      { date: '2023-06-23', slots: ['上午', '下午'] }
    ]
  },
  {
    id: '2',
    name: '儿童百天纪念摄影',
    price: 1299,
    originalPrice: 1699,
    images: [
      'https://images.unsplash.com/photo-1612103198005-b238154f4590',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9'
    ],
    description: '本套餐包含：\n1. 资深儿童摄影师\n2. 3组场景任选\n3. 20张精修照片\n4. 赠送精美相册一本\n5. 赠送照片视频MV\n6. 儿童服饰3套任选',
    services: ['多组场景', '赠送相册', '提供服装', '亲子互动'],
    category: '儿童',
    sales: 89,
    availableDates: [
      { date: '2023-06-22', slots: ['上午', '下午'] },
      { date: '2023-06-23', slots: ['上午'] },
      { date: '2023-06-24', slots: ['上午', '下午'] }
    ]
  },
  {
    id: '3',
    name: '毕业季个人写真套餐',
    price: 699,
    originalPrice: 799,
    images: [
      'https://images.unsplash.com/photo-1541534401786-2077eed87a74',
      'https://images.unsplash.com/photo-1594085901768-b8132b3b9b82',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'
    ],
    description: '青春毕业季，记录美好时刻：\n1. 校园场景拍摄\n2. 多组毕业主题\n3. 1套学士服装\n4. 15张精修照片\n5. 精美电子相册',
    services: ['毕业主题', '学士服装', '专业修图', '快速出片'],
    category: '写真',
    sales: 203,
    availableDates: [
      { date: '2023-06-24', slots: ['上午', '下午'] },
      { date: '2023-06-25', slots: ['上午', '下午'] }
    ]
  },
  {
    id: '4',
    name: '森系情侣写真套餐',
    price: 1299,
    originalPrice: 1599,
    images: [
      'https://images.unsplash.com/photo-1519011985187-444d62641929',
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
      'https://images.unsplash.com/photo-1604096952663-9c8e1ed5fcad'
    ],
    description: '浪漫森系风，适合情侣：\n1. 自然光影场景\n2. 资深情侣摄影师\n3. 2套服装任选\n4. 20张精修照片\n5. 赠送相册一本',
    services: ['外景拍摄', '提供服装', '精修照片', '私人定制'],
    category: '写真',
    sales: 176,
    availableDates: [
      { date: '2023-06-26', slots: ['上午', '下午'] },
      { date: '2023-06-27', slots: ['上午'] },
      { date: '2023-06-28', slots: ['上午', '下午'] }
    ]
  },
  {
    id: '5',
    name: '古风写真套餐',
    price: 1599,
    originalPrice: 1899,
    images: [
      'https://images.unsplash.com/photo-1596329911741-3aaadf76a3c3',
      'https://images.unsplash.com/photo-1531891570158-e71b35a485bc',
      'https://images.unsplash.com/photo-1590552278232-0a5fdc2ce7f7'
    ],
    description: '复古中国风：\n1. 古装场景拍摄\n2. 专业古风摄影师\n3. 3套传统服装任选\n4. 25张精修照片\n5. 传统相册',
    services: ['古风妆容', '传统服装', '场景布置', '精美相册'],
    category: '写真',
    sales: 128,
    availableDates: [
      { date: '2023-06-29', slots: ['上午', '下午'] },
      { date: '2023-06-30', slots: ['上午', '下午'] }
    ]
  }
]

// 模拟分类数据
const mockCategories: Category[] = [
  { id: '1', name: '婚纱摄影', icon: '👰' },
  { id: '2', name: '儿童摄影', icon: '👶' },
  { id: '3', name: '写真', icon: '📸' },
  { id: '4', name: '全家福', icon: '👨‍👩‍👧' },
  { id: '5', name: '毕业照', icon: '🎓' },
  { id: '6', name: '证件照', icon: '🪪' },
  { id: '7', name: '活动跟拍', icon: '🎬' },
  { id: '8', name: '更多', icon: '⋯' }
]

// 模拟API
export const mockApi = {
  // 商品相关
  getProducts: async (params?: { page?: number, pageSize?: number, category?: string }) => {
    await delay(300) // 模拟网络延迟
    
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const category = params?.category
    
    let filteredProducts = [...mockProducts]
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }
    
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedProducts = filteredProducts.slice(start, end)
    
    return {
      list: paginatedProducts,
      total: filteredProducts.length
    }
  },
  
  getProductDetail: async (id: string) => {
    await delay(200)
    const product = mockProducts.find(p => p.id === id)
    if (!product) {
      throw new Error('商品不存在')
    }
    return product
  },
  
  getCategories: async () => {
    await delay(100)
    return mockCategories
  },
  
  // 预约相关
  getAvailableSlots: async (params: { productId: string, date: string }) => {
    await delay(200)
    const product = mockProducts.find(p => p.id === params.productId)
    if (!product) {
      throw new Error('商品不存在')
    }
    
    const dateInfo = product.availableDates?.find(d => d.date === params.date)
    if (!dateInfo) {
      return []
    }
    
    return dateInfo.slots.map(slot => ({
      id: `${params.date}-${slot}`,
      startTime: slot === '上午' ? '09:00' : '14:00',
      endTime: slot === '上午' ? '12:00' : '17:00',
      isAvailable: true
    }))
  },
  
  createBooking: async (data: any) => {
    await delay(500)
    return {
      bookingId: `book-${Date.now()}`
    }
  }
}
