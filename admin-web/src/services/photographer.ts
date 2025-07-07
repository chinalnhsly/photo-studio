import request from "@/utils/request";

// 摄影师基本信息接口
export interface PhotographerData {
  id: number;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  featured?: boolean;
  level?: string;
  bio?: string;
  employeeId?: string;
  joinDate?: string;
  contractEndDate?: string;
  specialties?: string[];
  skills?: Array<{
    name: string;
    rating: number;
  }>;
  rating?: number;
  completedBookings?: number;
  satisfaction?: number;
  monthlyBookings?: number;
  totalBookings?: number;
  returnRate?: number;
  reviews?: any[];
  studios?: Array<{
    id: number;
    name: string;
  }>;
  // 其他属性
}

// 摄影师响应接口
export interface PhotographerResponse {
  success: boolean;
  data: PhotographerData;
  message?: string;
}

// 摄影师列表响应接口
export interface PhotographerListResponse {
  success: boolean;
  data: {
    total: number;
    list: PhotographerData[];
  };
  message?: string;
}

// 摄影师预约数据
export interface BookingData {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  customerId: number;
  customerName: string;
  shootingType: string;
  status: string;
  bookingNumber?: string;
  studioId?: number;
  studioName?: string;
  rating?: number;
  bookingTime?: string; // 用于日历显示
  title?: string; // 用于日历显示
}

// 摄影师预约响应接口
export interface PhotographerBookingsResponse {
  success: boolean;
  data: BookingData[];
  message?: string;
}

// 作品集数据
export interface PortfolioItem {
  id: number;
  title?: string;
  description?: string;
  url: string;
  fullUrl?: string; // 高清大图
  thumbnailUrl?: string; // 缩略图
  createdAt?: string;
  categoryId?: number;
  categoryName?: string;
  tags?: string[];
}

// 摄影师作品集响应接口
export interface PhotographerPortfolioResponse {
  success: boolean;
  data: PortfolioItem[];
  message?: string;
}

/**
 * 获取摄影师列表
 * @param params 查询参数
 */
export async function getPhotographerList(params?: any) {
  return request("/api/photographers", {
    params,
  });
}

/**
 * 获取摄影师详情
 * @param id 摄影师ID
 */
export async function getPhotographerDetail(id: number) {
  return request(`/api/photographers/${id}`);
}

/**
 * 创建摄影师
 * @param data 摄影师数据
 */
export async function createPhotographer(data: Partial<PhotographerData>) {
  return request("/api/photographers", {
    method: "POST",
    data,
  });
}

/**
 * 更新摄影师信息
 * @param id 摄影师ID
 * @param data 更新数据
 */
export async function updatePhotographer(
  id: number,
  data: Partial<PhotographerData>
) {
  return request(`/api/photographers/${id}`, {
    method: "PUT",
    data,
  });
}
// 更新摄影师状态
export async function updatePhotographerStatus(
  id: number,
  status: "active" | "inactive"
) {
  return request(`/api/photographers/${id}/status`, {
    method: "PUT",
    data: { status },
  });
}
/**
 * 删除摄影师
 * @param id 摄影师ID
 */
export async function deletePhotographer(id: number) {
  return request(`/api/photographers/${id}`, {
    method: "DELETE",
  });
}

/**
 * 获取摄影师预约列表
 * @param id 摄影师ID
 * @param params 查询参数
 */
export async function getPhotographerBookings(id: number, params?: any) {
  return request(`/api/photographers/${id}/bookings`, {
    params,
  });
}

/**
 * 获取摄影师作品集
 * @param id 摄影师ID
 * @param params 查询参数
 */
export async function getPhotographerPortfolio(id: number, params?: any) {
  return request(`/api/photographers/${id}/portfolio`, {
    params,
  });
}

/**
 * 上传摄影师头像
 * @param id 摄影师ID
 * @param formData 表单数据
 */
export async function uploadPhotographerAvatar(id: number, formData: FormData) {
  return request(`/api/photographers/${id}/avatar`, {
    method: "POST",
    data: formData,
    requestType: "form",
  });
}

/**
 * 添加作品到摄影师作品集
 * @param id 摄影师ID
 * @param data 作品数据
 */
export async function addPhotographerPortfolio(
  id: number,
  data: PortfolioItem | PortfolioItem[]
) {
  return request(`/api/photographers/${id}/portfolio`, {
    method: "POST",
    data: Array.isArray(data) ? { items: data } : { item: data },
  });
}

/**
 * 删除摄影师作品
 * @param photographerId 摄影师ID
 * @param portfolioId 作品ID
 */
export async function deletePhotographerPortfolio(
  photographerId: number,
  portfolioId: number
) {
  return request(
    `/api/photographers/${photographerId}/portfolio/${portfolioId}`,
    {
      method: "DELETE",
    }
  );
}

/**
 * 设置/取消摄影师为推荐摄影师
 * @param id 摄影师ID
 * @param featured 是否推荐
 */
export async function updatePhotographerFeatured(
  id: number,
  featured: boolean
) {
  return request(`/api/photographers/${id}/featured`, {
    method: "PUT",
    data: { featured },
  });
}

/**
 * 更新摄影师技能
 * @param id 摄影师ID
 * @param skills 技能数组
 */
export async function updatePhotographerSkills(
  id: number,
  skills: Array<{ name: string; rating: number }>
) {
  return request(`/api/photographers/${id}/skills`, {
    method: "PUT",
    data: { skills },
  });
}

/**
 * 获取摄影师统计数据
 * @param id 摄影师ID
 */
export async function getPhotographerStats(id: number) {
  return request(`/api/photographers/${id}/stats`);
}

/**
 * 获取摄影师可用时间段
 * @param id 摄影师ID
 * @param date 日期 (YYYY-MM-DD)
 */
export async function getPhotographerAvailability(id: number, date: string) {
  return request(`/api/photographers/${id}/availability`, {
    params: { date },
  });
}
