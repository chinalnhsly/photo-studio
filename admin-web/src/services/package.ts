import request from '../utils/request';

// 套餐类型接口
export interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  images: string[];
  coverImage: string;
  duration: number; // 拍摄时长（分钟）
  shootingType: string; // 拍摄类型
  includedItems: string[]; // 包含项目
  status: 'active' | 'inactive' | 'deleted';
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
  photographerCount?: number; // 可提供此套餐的摄影师数量
  studioIds?: number[]; // 可用的工作室IDs
  tags?: string[];
}

// 套餐详情接口
export interface PackageDetail extends Package {
  bookingNotes?: string; // 预约须知
  refundPolicy?: string; // 退款政策
  serviceProcess?: string; // 服务流程
  reviews?: PackageReview[]; // 评价
  photographers?: PackagePhotographer[]; // 摄影师列表
  studios?: PackageStudio[]; // 可用工作室列表
  similarPackages?: Package[]; // 类似套餐
}

// 套餐评价接口
export interface PackageReview {
  id: number;
  customerId: number;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5 星
  content: string;
  images?: string[]; // 评价图片
  createdAt: string;
  replyContent?: string;
  replyTime?: string;
}

// 套餐摄影师接口
export interface PackagePhotographer {
  id: number;
  name: string;
  avatar?: string;
  rating?: number;
  specialties?: string[];
  experience?: number; // 工作经验（年）
}

// 套餐工作室接口
export interface PackageStudio {
  id: number;
  name: string;
  address: string;
  images?: string[];
  features?: string[]; // 特点，如"自然光""水下摄影"等
}

/**
 * 获取套餐列表
 * @param params 查询参数
 * @returns 套餐列表数据
 */
export async function getPackageList(params?: any): Promise<{
  data: {
    items: Package[];
    total: number;
  };
  success: boolean;
}> {
  return request.get('/api/packages', { params }) as unknown as Promise<{
    data: {
      items: Package[];
      total: number;
    };
    success: boolean;
  }>;
}

/**
 * 获取套餐详情
 * @param id 套餐ID
 * @returns 套餐详情数据
 */
export async function getPackageDetail(id: number): Promise<{
  data: PackageDetail;
  success: boolean;
}> {
  return request.get(`/api/packages/${id}`) as unknown as Promise<{
    data: PackageDetail;
    success: boolean;
  }>;
}

/**
 * 创建套餐
 * @param data 套餐数据
 * @returns 创建结果
 */
export async function createPackage(data: Omit<Package, 'id' | 'createdAt' | 'updatedAt' | 'soldCount'>): Promise<{
  data: Package;
  success: boolean;
}> {
  return request.post('/api/packages', data) as unknown as Promise<{
    data: Package;
    success: boolean;
  }>;
}

/**
 * 更新套餐
 * @param id 套餐ID
 * @param data 更新数据
 * @returns 更新结果
 */
export async function updatePackage(id: number, data: Partial<Package>): Promise<{
  data: Package;
  success: boolean;
}> {
  return request.put(`/api/packages/${id}`, data) as unknown as Promise<{
    data: Package;
    success: boolean;
  }>;
}

/**
 * 删除套餐
 * @param id 套餐ID
 * @returns 删除结果
 */
export async function deletePackage(id: number): Promise<{
  success: boolean;
}> {
  return request.delete(`/api/packages/${id}`) as unknown as Promise<{
    success: boolean;
  }>;
}

/**
 * 批量删除套餐
 * @param ids 套餐ID数组
 * @returns 批量删除结果
 */
export async function batchDeletePackages(ids: number[]): Promise<{
  success: boolean;
}> {
  return request.post('/api/packages/batch-delete', { ids }) as unknown as Promise<{
    success: boolean;
  }>;
}

/**
 * 上传套餐图片
 * @param id 套餐ID（可选，不提供则为新套餐上传图片）
 * @param formData 包含图片文件的表单数据
 * @returns 上传结果
 */
export async function uploadPackageImages(id: number | undefined, formData: FormData): Promise<{
  data: {
    urls: string[];
  };
  success: boolean;
}> {
  const url = id ? `/api/packages/${id}/images` : '/api/packages/images';
  return request.post(url, {
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) as unknown as Promise<{
    data: {
      urls: string[];
    };
    success: boolean;
  }>;
}

/**
 * 设置套餐封面图
 * @param id 套餐ID
 * @param imageUrl 图片URL
 * @returns 设置结果
 */
export async function setPackageCoverImage(id: number, imageUrl: string): Promise<{
  success: boolean;
}> {
  return request.put(`/api/packages/${id}/cover-image`, { coverImage: imageUrl }) as unknown as Promise<{
    success: boolean;
  }>;
}

/**
 * 获取套餐评价列表
 * @param id 套餐ID
 * @param params 查询参数
 * @returns 评价列表数据
 */
export async function getPackageReviews(id: number, params?: any): Promise<{
  data: {
    items: PackageReview[];
    total: number;
  };
  success: boolean;
}> {
  return request.get(`/api/packages/${id}/reviews`, { params }) as unknown as Promise<{
    data: {
      items: PackageReview[];
      total: number;
    };
    success: boolean;
  }>;
}

/**
 * 回复套餐评价
 * @param packageId 套餐ID
 * @param reviewId 评价ID
 * @param content 回复内容
 * @returns 回复结果
 */
export async function replyPackageReview(packageId: number, reviewId: number, content: string): Promise<{
  success: boolean;
}> {
  return request.post(`/api/packages/${packageId}/reviews/${reviewId}/reply`, { content }) as unknown as Promise<{
    success: boolean;
  }>;
}

/**
 * 获取套餐统计数据
 * @param id 套餐ID
 * @returns 统计数据
 */
export async function getPackageStats(id: number): Promise<{
  data: {
    viewCount: number;
    soldCount: number;
    bookingCount: number;
    reviewCount: number;
    averageRating: number;
  };
  success: boolean;
}> {
  return request.get(`/api/packages/${id}/stats`) as unknown as Promise<{
    data: {
      viewCount: number;
      soldCount: number;
      bookingCount: number;
      reviewCount: number;
      averageRating: number;
    };
    success: boolean;
  }>;
}
