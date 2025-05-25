import request from '../utils/request';

export interface DashboardData {
  bookingCount: number;
  customerCount: number;
  photographerCount: number;
  studioCount: number;
  recentBookings: any[];
  keyMetrics: any[];
}

// 获取仪表盘数据
export async function getDashboardData(): Promise<{ data: DashboardData }> {
  return request('/api/dashboard/overview');
}

// 获取仪表盘统计数据
export async function getDashboardStats(params?: { startDate: string; endDate: string }) {
  return request('/api/dashboard/stats', {
    method: 'GET',
    params,
  });
}

// 获取销售数据
export async function getSalesData(params?: { startDate: string; endDate: string }) {
  return request('/api/dashboard/sales', {
    method: 'GET',
    params,
  });
}

// 获取预约统计数据
export async function getAppointmentStats() {
  return request('/api/dashboard/appointments/stats', {
    method: 'GET',
  });
}

// 获取热销商品
export async function getTopProducts(params?: { limit?: number }) {
  return request('/api/dashboard/products/top', {
    method: 'GET',
    params: params || { limit: 5 },
  });
}

// 获取最近评价
export async function getRecentReviews(params?: { limit?: number }) {
  return request('/api/dashboard/reviews/recent', {
    method: 'GET',
    params: params || { limit: 5 },
  });
}

// 获取即将进行的预约
export async function getUpcomingAppointments(params?: { limit?: number }) {
  return request('/api/dashboard/appointments/upcoming', {
    method: 'GET',
    params: params || { limit: 5 },
  });
}

// 获取业务总览分析数据
export async function getBusinessAnalytics(params: {
  startDate: string;
  endDate: string;
  periodType: 'daily' | 'weekly' | 'monthly';
}) {
  return request('/api/dashboard/overview', {
    method: 'GET',
    params,
  });
}

// 获取预约分析数据
export async function getBookingAnalytics(params: {
  startDate: string;
  endDate: string;
  periodType: 'daily' | 'weekly' | 'monthly';
  photographerId?: number;
  studioId?: number;
}) {
  return request('/api/dashboard/booking-analytics', {
    method: 'GET',
    params,
  });
}

// 获取客户分析数据
export async function getCustomerAnalytics(params: {
  startDate: string;
  endDate: string;
  periodType: 'daily' | 'weekly' | 'monthly';
  segment?: string;
}) {
  return request('/api/dashboard/customer-analytics', {
    method: 'GET',
    params,
  });
}

// 获取收入分析数据
export async function getRevenueAnalytics(params: {
  startDate: string;
  endDate: string;
  periodType: 'daily' | 'weekly' | 'monthly';
  category?: string;
}) {
  return request('/api/dashboard/revenue-analytics', {
    method: 'GET',
    params,
  });
}

// 获取摄影师绩效分析数据
export async function getPhotographerPerformance(params: {
  startDate: string;
  endDate: string;
  photographerId?: number;
}) {
  return request('/api/dashboard/photographer-performance', {
    method: 'GET',
    params,
  });
}

// 获取工作室使用率分析数据
export async function getStudioUtilization(params: {
  startDate: string;
  endDate: string;
  studioId?: number;
}) {
  return request('/api/dashboard/studio-utilization', {
    method: 'GET',
    params,
  });
}

// 导出分析报表
export async function exportAnalyticsReport(params: {
  startDate: string;
  endDate: string;
  reportType: 'overview' | 'booking' | 'customer' | 'revenue';
}) {
  return request('/api/dashboard/export-report', {
    method: 'GET',
    params,
    responseType: 'blob',
  }).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${params.reportType}_report_${params.startDate}_to_${params.endDate}.xlsx`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// 获取自定义时间范围的数据
export async function getCustomRangeStats(params: {
  startDate: string;
  endDate: string;
  metrics: string[];
}) {
  return request('/api/dashboard/custom-range', {
    method: 'GET',
    params,
  });
}

// 保存仪表板配置
export async function saveDashboardConfig(config: any) {
  return request('/api/dashboard/save-config', {
    method: 'POST',
    data: config,
  });
}

// 获取仪表板配置
export async function getDashboardConfig() {
  return request('/api/dashboard/get-config', {
    method: 'GET',
  });
}
