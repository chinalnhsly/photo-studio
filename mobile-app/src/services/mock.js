// 模拟服务API - 从TypeScript转换而来
import Taro from '@tarojs/taro';

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @typedef {Object} Product
 * @property {string} id - 商品ID
 * @property {string} title - 商品标题
 * @property {string} image - 商品图片
 * @property {number} price - 商品价格
 * @property {number} originalPrice - 原价
 * @property {number} sales - 销量
 * @property {string} description - 商品描述
 */

/**
 * 模拟商品数据
 * @type {Product[]}
 */
const mockProducts = [
  {
    id: '1',
    title: '韩式婚纱摄影',
    image: 'https://placehold.co/300x200/E6E6FA/333?text=婚纱套餐',
    price: 3999,
    originalPrice: 5999,
    sales: 128,
    description: '韩式婚纱摄影，含化妆、服装和拍摄'
  },
  {
    id: '2',
    title: '小清新写真',
    image: 'https://placehold.co/300x200/FFF8DC/333?text=写真套餐',
    price: 999,
    originalPrice: 1599,
    sales: 256,
    description: '小清新风格写真，适合青春少女'
  },
  {
    id: '3',
    title: '全家福套餐',
    image: 'https://placehold.co/300x200/F0FFF0/333?text=全家福',
    price: 1299,
    originalPrice: 1999,
    sales: 86,
    description: '全家福拍摄，适合3-6人家庭'
  }
];

/**
 * 模拟获取商品列表
 * @returns {Promise<Product[]>}
 */
export const getProducts = async () => {
  // 模拟网络延迟
  await delay(800);
  return mockProducts;
};

/**
 * 模拟获取商品详情
 * @param {string} id - 商品ID
 * @returns {Promise<Product|null>}
 */
export const getProductById = async (id) => {
  await delay(600);
  const product = mockProducts.find(item => item.id === id);
  return product || null;
};

/**
 * 模拟商品搜索
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Product[]>}
 */
export const searchProducts = async (keyword) => {
  await delay(500);
  if (!keyword) return mockProducts;
  
  return mockProducts.filter(item => 
    item.title.includes(keyword) || 
    item.description.includes(keyword)
  );
};

// 添加 mockApi 导出以匹配导入语句
export const mockApi = {
  getProducts,
  getProductById,
  searchProducts,
  // 添加任何其他可能需要的方法
  getBookings: async () => {
    await delay(700);
    return [
      { id: '1', date: '2025-04-20', time: '10:00', service: '婚纱摄影' },
      { id: '2', date: '2025-05-01', time: '14:30', service: '写真套餐' }
    ];
  },
  createBooking: async (data) => {
    await delay(500);
    return { 
      id: 'new-' + Date.now(),
      status: 'success',
      ...data
    };
  }
};

// 默认导出所有方法
export default {
  getProducts,
  getProductById,
  searchProducts,
  ...mockApi
};
