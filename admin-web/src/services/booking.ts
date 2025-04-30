import request from "umi-request";

// 获取预约列表
export async function getBookingList(params?: any) {
  return request('/api/bookings', {
    params,
  });
}

// 获取预约详情
export async function getBookingById(id: number) {
  return request(`/api/bookings/${id}`);
}

// 创建预约
export async function createBooking(data: {
  customerId: number;
  studioId: number;
  photographerId: number;
  packageId: number;
  bookingDate: string;
  bookingTime: string;
  duration?: number;
  additionalServices?: number[];
  notes?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}) {
  return request<CreateBookingResponse>('/api/bookings', {
    method: 'POST',
    data,
  });
}

// 更新预约
export async function updateBooking(id: number, data: {
  bookingDate?: string;
  bookingTime?: string;
  photographerId?: number;
  packageId?: number;
  additionalServices?: number[];
  notes?: string;
  adminNotes?: string;
  status?: string;
  paymentStatus?: string;
  discount?: number;
}) {
  return request<{ success: boolean; message?: string }>(`/api/bookings/${id}`, {
    method: 'PUT',
    data,
  });
}

// 取消预约
export async function cancelBooking(id: number, reason: string) {
  return request(`/api/bookings/${id}/cancel`, {
    method: 'POST',
    data: { reason },
  });
}

// 更新预约状态
export interface BookingStatusUpdate {
  status: string;
  cancellationReason?: string;
  adminNotes?: string;
}

export async function updateBookingStatus(id: number, data: BookingStatusUpdate) {
  return request(`/api/bookings/${id}/status`, {
    method: 'PUT',
    data,
  });
}

// 获取可用时间段
export async function getAvailableTimeSlots(params: {
  date: string;
  studioId?: number;
  photographerId?: number;
}) {
  return request('/api/bookings/available-slots', {
    params,
  });
}

// 获取预约统计数据
export interface BookingStatsParams {
  startDate?: string;
  endDate?: string;
  studioId?: number;
}

export interface BookingStatsData {
  totalBookings: number;
  completedBookings: number;
  canceledBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  avgBookingsPerDay: number;
}

export async function getBookingStats(params?: BookingStatsParams) {
  return request<{ data: BookingStatsData; success: boolean }>('/api/bookings/stats', {
    method: 'GET',
    params,
  });
}

// 获取预约趋势数据
export interface BookingTrendsParams {
  startDate?: string;
  endDate?: string;
  studioId?: number;
  type?: 'day' | 'week' | 'month'; // 按日/周/月聚合
}

export interface BookingTrendItem {
  date: string;
  bookings: number;
  revenue?: number;
}

export async function getBookingTrends(params?: BookingTrendsParams) {
  return request<{ data: BookingTrendItem[]; success: boolean }>('/api/bookings/trends', {
    method: 'GET',
    params,
  });
}

// 获取摄影师工作负荷
export interface PhotographerWorkloadParams {
  startDate?: string;
  endDate?: string;
  studioId?: number;
}

export interface PhotographerWorkloadItem {
  photographerId: number;
  photographerName: string;
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  workHours: number;
  avatar?: string;
}

export async function getPhotographerWorkload(params?: PhotographerWorkloadParams) {
  return request<{ data: PhotographerWorkloadItem[]; success: boolean }>('/api/photographers/workload', {
    method: 'GET',
    params,
  });
}

// 预约详情响应类型
export interface BookingDetailResponse {
  success: boolean;
  data: {
    id: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAvatar?: string;
    customerId: number;
    studioId: number;
    studioName: string;
    photographerId: number;
    photographerName: string;
    packageId: number;
    packageName: string;
    packagePrice: number;
    status: string;
    bookingDate: string;
    bookingTime: string;
    date?: string; // 兼容日期格式
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    duration: number;
    shootingType?: string;
    totalPrice: number;
    discount?: number;
    finalPrice: number;
    paymentStatus: string;
    paymentMethod?: string;
    notes?: string;
    adminNotes?: string;
    staffNotes?: string;
    createdAt: string;
    updatedAt: string;
    additionalServices?: {
      id: number;
      name: string;
      price: number;
    }[];
    timeline?: {
      time: string;
      status: string;
      description: string;
      operator?: string;
    }[];
  };
}

// 获取预约详情
export async function getBookingDetail(id: number) {
  return request<BookingDetailResponse>(`/api/bookings/${id}/detail`);
}

// 可用时间段类型
export interface AvailableTimeslot {
  startTime: string;
  endTime: string;
  available: boolean;
  photographerId?: number;
  photographerName?: string;
}

// 可用时间段响应类型
export interface AvailableTimeslotsResponse {
  success: boolean;
  data: {
    date: string;
    timeSlots: AvailableTimeslot[];
  };
}

// 获取可用时间段
export async function getAvailableTimeslots(params: {
  date: string;
  studioId: number;
  packageId?: number;
  photographerId?: number;
}) {
  return request<AvailableTimeslotsResponse>('/api/bookings/available-timeslots', {
    method: 'GET',
    params,
  });
}

// 可用性检查响应类型
export interface AvailabilityCheckResponse {
  success: boolean;
  data: {
    available: boolean;
    isAvailable?: boolean; // 兼容字段
    conflictReason?: string;
    conflicts?: string; // 兼容字段
    alternativeTimeSlots?: {
      date: string;
      timeSlots: {
        startTime: string;
        endTime: string;
        photographerId?: number;
        photographerName?: string;
      }[];
    }[];
  };
}

// 检查时间段可用性
export async function checkAvailability(params: {
  date: string;
  startTime: string;
  endTime: string;
  studioId: number;
  photographerId?: number;
  packageId?: number;
}) {
  return request<AvailabilityCheckResponse>('/api/bookings/check-availability', {
    method: 'POST',
    data: params,
  });
}

// 创建预约响应类型
export interface CreateBookingResponse {
  success: boolean;
  data: {
    id: number;
    bookingNumber: string;
    customerId: number;
    customerName: string;
    bookingDate: string;
    bookingTime: string;
    status: string;
    createdAt: string;
  };
  message?: string;
}
