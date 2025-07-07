import request from '@/utils/request';

// --- 接口定义 ---
export interface Booking {
  id: number;
  bookingNumber?: string; // 添加预约号
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string; // 添加客户邮箱
  customerAvatar?: string; // 添加客户头像
  photographerId?: number;
  photographerName?: string;
  studioId?: number;
  studioName?: string;
  date: string;
  startTime: string;
  endTime: string;
  shootingType: string;
  status: string;
  notes?: string;
  staffNotes?: string; // 添加内部备注
  packageId?: number;
  packageName?: string;
  createdAt: string;
  updatedAt: string;
  // 可以根据实际API返回添加更多字段
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  photographerId?: number; // 可选，用于显示冲突信息
  photographerName?: string; // 可选
  studioId?: number; // 可选
  studioName?: string; // 可选
}

// --- 响应类型定义 ---
export interface BookingDetailResponse {
  data: Booking;
}

export interface AvailableTimeslotsResponse {
  // data 应该直接是 TimeSlot 数组，而不是包含 timeSlots 的对象
  data: TimeSlot[];
}

export interface AvailabilityCheckResponse {
  data: {
    available: boolean;
    reason?: string; // 如果不可用，提供原因
    // 添加 alternativeTimeSlots 定义 (结构根据实际API调整)
    alternativeTimeSlots?: Array<{
      photographerId?: number;
      studioId?: number;
      timeSlots: TimeSlot[];
    }>;
    // 或者更简单的冲突信息
    conflicts?: Array<{
      type: 'photographer' | 'studio' | 'time';
      startTime: string;
      endTime: string;
      resourceId?: number;
      resourceName?: string;
    }>
  };
}

export interface CreateBookingResponse {
  data: Booking; // 假设创建成功后返回预约详情
  message?: string;
  code?: number;
}

export interface UpdateBookingResponse {
  data: Booking; // 假设更新成功后返回预约详情
  message?: string;
  code?: number;
}

// --- API 函数 ---

// 获取预约列表
export async function getBookingList(params?: any): Promise<{ data: { items: Booking[], total: number } }> {
  return request('/api/bookings', {
    method: 'GET',
    params,
  });
}

// 获取预约详情
export async function getBookingDetail(id: number): Promise<BookingDetailResponse> {
  return request(`/api/bookings/${id}`, {
    method: 'GET',
  });
}

// 创建预约
export async function createBooking(data: any): Promise<CreateBookingResponse> {
  return request('/api/bookings', {
    method: 'POST',
    data,
  });
}

// 更新预约
export async function updateBooking(id: number, data: any): Promise<UpdateBookingResponse> {
  return request(`/api/bookings/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除预约
export async function deleteBooking(id: number): Promise<{ message?: string; code?: number }> {
  return request(`/api/bookings/${id}`, {
    method: 'DELETE',
  });
}

// 更新预约状态
export async function updateBookingStatus(id: number, status: string): Promise<{ message?: string; code?: number }> {
  return request(`/api/bookings/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

// 获取可用时间段
export async function getAvailableTimeSlots(params: {
  date: string;
  studioId?: number;
  photographerId?: number;
}): Promise<AvailableTimeslotsResponse> {
  return request('/api/bookings/available-slots', {
    method: 'GET',
    params,
  });
}

/**
 * 检查特定时间段的可用性
 * @param params - 查询参数
 */
export async function checkAvailability(params: {
  date: string;
  startTime: string;
  endTime: string;
  studioId?: number;
  photographerId?: number;
  excludeBookingId?: number; // 编辑时排除当前预约
}): Promise<AvailabilityCheckResponse> {
  // 注意：这里使用了之前定义的 checkTimeSlotConflict 接口路径
  // 如果后端有专门的 checkAvailability 接口，请修改路径
  return request('/api/bookings/check-conflict', {
    method: 'GET',
    params,
  });
}

// 批量操作预约
export async function batchOperateBookings(ids: number[], action: string): Promise<{ message?: string; code?: number }> {
  return request('/api/bookings/batch', {
    method: 'POST',
    data: { ids, action },
  });
}

// 获取预约日历数据
export async function getBookingCalendar(params: {
  startDate: string;
  endDate: string;
  studioId?: number;
  photographerId?: number;
}): Promise<{ data: Booking[] }> { // 假设返回 Booking 数组
  return request('/api/bookings/calendar', {
    method: 'GET',
    params,
  });
}

// 检查时间段冲突 (保留，checkAvailability 可能调用此接口)
export async function checkTimeSlotConflict(params: {
  date: string;
  startTime: string;
  endTime: string;
  studioId?: number;
  photographerId?: number;
  excludeBookingId?: number;
}): Promise<AvailabilityCheckResponse> {
  return request('/api/bookings/check-conflict', {
    method: 'GET',
    params,
  });
}

// 发送预约提醒
export async function sendBookingReminder(id: number): Promise<{ message?: string; code?: number }> {
  return request(`/api/bookings/${id}/send-reminder`, {
    method: 'POST',
  });
}

// 获取预约统计
export async function getBookingStatistics(params?: {
  startDate?: string;
  endDate?: string;
  studioId?: number;
  photographerId?: number;
}): Promise<{ data: any }> { // 具体类型根据API定义
  return request('/api/bookings/statistics', {
    method: 'GET',
    params,
  });
}

/**
 * 获取预约关键统计数据
 * @param params - 查询参数，例如 { startDate, endDate, period }
 */
export async function getBookingStats(params?: {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}): Promise<{ data: any }> { // 具体类型根据API定义
  return request('/api/bookings/stats', {
    method: 'GET',
    params,
  });
}

/**
 * 获取预约趋势数据
 * @param params - 查询参数，例如 { startDate, endDate, period, metric }
 */
export async function getBookingTrends(params?: {
  startDate?: string;
  endDate?: string;
  period?: 'daily' | 'weekly' | 'monthly';
  metric?: 'count' | 'revenue'; // 示例指标
}): Promise<{ data: any }> { // 具体类型根据API定义
  return request('/api/bookings/trends', {
    method: 'GET',
    params,
  });
}

/**
 * 获取摄影师工作量数据
 * @param params - 查询参数，例如 { startDate, endDate, photographerId }
 */
export async function getPhotographerWorkload(params?: {
  startDate?: string;
  endDate?: string;
  photographerId?: number;
}): Promise<{ data: any }> { // 具体类型根据API定义
  return request('/api/photographers/workload', {
    method: 'GET',
    params,
  });
}
