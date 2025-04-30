import Taro from '@tarojs/taro';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 影楼商城API服务
export const shopApi = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Array>} 商品列表
   */
  getProducts: async (params = {}) => {
    // 模拟网络延迟
    await delay(800);
    
    // 模拟商品数据
    const products = [
      {
        id: '1',
        title: '韩式婚纱摄影',
        price: 3999,
        originalPrice: 5999,
        image: 'https://placehold.co/300x200/E6E6FA/333?text=婚纱套餐',
        sales: 128,
        categoryId: '1'
      },
      {
        id: '2',
        title: '小清新写真',
        price: 999,
        originalPrice: 1599,
        image: 'https://placehold.co/300x200/FFF8DC/333?text=写真套餐',
        sales: 256,
        categoryId: '2'
      },
      {
        id: '3',
        title: '全家福套餐',
        price: 1299,
        originalPrice: 1999,
        image: 'https://placehold.co/300x200/F0FFF0/333?text=全家福',
        sales: 86,
        categoryId: '3'
      },
      {
        id: '4',
        title: '儿童摄影',
        price: 699,
        originalPrice: 999,
        image: 'https://placehold.co/300x200/F0F8FF/333?text=儿童摄影',
        sales: 157,
        categoryId: '4'
      }
    ];
    
    // 过滤
    if (params.categoryId) {
      return products.filter(p => p.categoryId === params.categoryId);
    }
    
    // 搜索
    if (params.keyword) {
      return products.filter(p => 
        p.title.includes(params.keyword)
      );
    }
    
    return products;
  },
  
  /**
   * 获取商品详情
   * @param {string} id - 商品ID
   * @returns {Promise<Object>} 商品详情
   */
  getProductDetail: async (id) => {
    await delay(600);
    
    const details = {
      '1': {
        id: '1',
        title: '韩式婚纱摄影',
        price: 3999,
        originalPrice: 5999,
        sales: 128,
        images: [
          'https://placehold.co/600x400/E6E6FA/333?text=婚纱照1',
          'https://placehold.co/600x400/E6E6FA/333?text=婚纱照2',
          'https://placehold.co/600x400/E6E6FA/333?text=婚纱照3'
        ],
        description: '专业韩式婚纱摄影服务，包含多套服装、专业化妆、多场景拍摄等',
        features: [
          '含3套服装造型',
          '含精修照片20张',
          '全程化妆师服务',
          '提供电子和实体相册'
        ]
      },
      '2': {
        id: '2',
        title: '小清新写真',
        price: 999,
        originalPrice: 1599,
        sales: 256,
        images: [
          'https://placehold.co/600x400/FFF8DC/333?text=写真1',
          'https://placehold.co/600x400/FFF8DC/333?text=写真2'
        ],
        description: '小清新风格写真，适合青春少女，捕捉最美瞬间',
        features: [
          '含2套服装造型',
          '含精修照片10张',
          '专业摄影师指导',
          '提供电子相册'
        ]
      }
    };
    
    return details[id] || null;
  },
  
  /**
   * 获取分类列表
   * @returns {Promise<Array>} 分类列表
   */
  getCategories: async () => {
    await delay(500);
    
    return [
      { id: '1', name: '婚纱摄影', icon: 'https://placehold.co/80/FFC0CB/fff?text=婚纱' },
      { id: '2', name: '写真套餐', icon: 'https://placehold.co/80/E6E6FA/fff?text=写真' },
      { id: '3', name: '全家福', icon: 'https://placehold.co/80/F0FFF0/fff?text=全家福' },
      { id: '4', name: '儿童摄影', icon: 'https://placehold.co/80/FFFACD/fff?text=儿童' },
      { id: '5', name: '形象照', icon: 'https://placehold.co/80/E0FFFF/fff?text=形象照' },
      { id: '6', name: '艺术照', icon: 'https://placehold.co/80/FFF0F5/fff?text=艺术照' },
      { id: '7', name: '闺蜜照', icon: 'https://placehold.co/80/F0F8FF/fff?text=闺蜜' },
      { id: '8', name: '其他服务', icon: 'https://placehold.co/80/F5F5F5/999?text=其他' }
    ];
  },
  
  /**
   * 获取预约信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Array>} 预约列表
   */
  getBookings: async (userId = '1') => {
    await delay(700);
    
    return [
      { 
        id: '1', 
        productId: '1',
        productName: '韩式婚纱摄影',
        date: '2023-05-20', 
        time: '10:00',
        status: 'confirmed',
        address: '北京市朝阳区星光大道88号'
      },
      { 
        id: '2', 
        productId: '2',
        productName: '小清新写真',
        date: '2023-06-01', 
        time: '14:00',
        status: 'pending',
        address: '北京市海淀区创意园66号'
      }
    ];
  },
  
  /**
   * 模拟创建预约
   * @param {Object} bookingData - 预约数据
   * @returns {Promise<Object>} 创建结果
   */
  createBooking: async (bookingData) => {
    await delay(1000);
    
    // 模拟成功
    return {
      success: true,
      id: 'new-' + Date.now(),
      ...bookingData
    };
  }
};

// 导出API
export default shopApi;
