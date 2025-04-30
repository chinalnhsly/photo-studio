// 产品类型
export enum ProductType {
  PACKAGE = 'package', // 套餐
  SINGLE = 'single',   // 单品
  SERVICE = 'service', // 服务
  ADDON = 'addon',     // 附加项
}

// 产品接口定义
export interface Product {
  id: number;
  name: string;
  code?: string;
  type: ProductType;
  categoryId: number;
  category?: Category;
  price: number;
  originalPrice?: number;
  description?: string;
  shortDescription?: string;
  coverImage?: string;
  images?: string[];
  isActive: boolean;
  isRecommended: boolean;
  isHot: boolean;
  isNew: boolean;
  salesCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  details?: ProductDetail;
  options?: ProductOption[];
  packageItems?: PackageItem[];
}

// 产品详情
export interface ProductDetail {
  specs?: {
    key: string;
    value: string;
  }[];
  includes?: string[];
  excludes?: string[];
  notes?: string;
  duration?: number; // 时长（分钟）
  requiredPhotographerCount?: number; // 需要的摄影师数量
  shootingLocation?: string; // 拍摄地点
  deliveryTime?: number; // 交付时间（天）
  sampleImageUrls?: string[]; // 样片图片URL
  preparationGuidance?: string; // 拍摄准备指南
}

// 产品分类
export interface Category {
  id: number;
  name: string;
  code?: string;
  parentId?: number;
  level: number;
  path?: string;
  children?: Category[];
  productCount?: number;
  sortOrder: number;
  coverImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

// 产品选项
export interface ProductOption {
  id: number;
  productId: number;
  name: string;
  values: ProductOptionValue[];
  required: boolean;
  sortOrder: number;
  type: 'select' | 'radio' | 'checkbox'; // 选项类型
}

// 产品选项值
export interface ProductOptionValue {
  id: number;
  optionId: number;
  name: string;
  price: number;
  sortOrder: number;
  image?: string;
  description?: string;
}

// 产品套餐内容
export interface PackageItem {
  id: number;
  packageId: number;
  productId: number;
  product?: Product;
  quantity: number;
  notes?: string;
  price?: number; // 该产品在套餐中的价格，可能与产品本身的价格不同
}

// 产品评价
export interface ProductReview {
  id: number;
  productId: number;
  customerId: number;
  customerName: string;
  rating: number; // 1-5星
  title?: string;
  content: string;
  images?: string[];
  verified: boolean; // 是否是已购买的客户
  createdAt: string;
  updatedAt: string;
  response?: {
    content: string;
    respondedAt: string;
  };
}

// 产品库存记录
export interface ProductInventory {
  id: number;
  productId: number;
  inStock: number;
  lowStockThreshold?: number;
  sku?: string;
  lastUpdatedAt: string;
}

// 产品统计数据
export interface ProductStats {
  productId: number;
  viewCount: number;
  orderCount: number;
  totalSales: number;
  conversion: number; // 转化率
  averageRating: number;
  reviewCount: number;
}

// 产品搜索请求参数
export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  isRecommended?: boolean;
  sortBy?: 'price' | 'createdAt' | 'salesCount' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
