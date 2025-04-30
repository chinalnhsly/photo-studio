import request from '../utils/request';

/**
 * 获取评价分析概览数据
 * @param params 查询参数
 */
export async function getReviewAnalytics(params?: any) {
  return request('/api/admin/analytics/reviews/overview', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价趋势数据
 * @param params 查询参数
 */
export async function getReviewTrend(params?: any) {
  return request('/api/admin/analytics/reviews/trend', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价最多的商品
 * @param params 查询参数
 */
export async function getTopReviewedProducts(params?: any) {
  return request('/api/admin/analytics/reviews/top-products', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价关键词分析
 * @param params 查询参数
 */
export async function getReviewKeywords(params?: any) {
  return request('/api/admin/analytics/reviews/keywords', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价数据对比
 * @param params 查询参数
 */
export async function getReviewComparison(params?: any) {
  return request('/api/admin/analytics/reviews/comparison', {
    method: 'GET',
    params
  });
}

/**
 * 导出评价分析报告
 * @param params 查询参数
 */
export async function exportReviewReport(params?: any) {
  return request('/api/admin/analytics/reviews/export', {
    method: 'GET',
    params,
    responseType: 'blob'
  });
}

/**
 * 获取用户评价行为分析
 * @param params 查询参数
 */
export async function getUserReviewBehavior(params?: any) {
  return request('/api/admin/analytics/reviews/user-behavior', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价情感分析结果
 * @param params 查询参数
 */
export async function getSentimentAnalysis(params?: any) {
  return request('/api/admin/analytics/reviews/sentiment', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价热力图数据
 * @param params 查询参数
 */
export async function getReviewHeatmap(params?: any) {
  return request('/api/admin/analytics/reviews/heatmap', {
    method: 'GET',
    params
  });
}

/**
 * 获取评价质量分析
 * @param params 查询参数
 */
export async function getReviewQualityAnalysis(params?: any) {
  return request('/api/admin/analytics/reviews/quality', {
    method: 'GET',
    params
  });
}

// 获取业务分析数据
export async function getBusinessAnalytics(params: { 
  startDate: string;
  endDate: string;
  photographerId?: number;
  studioId?: number;
}) {
  return request.get('/api/analytics/business', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 获取业务趋势数据
export async function getBusinessTrends(params: { 
  startDate: string; 
  endDate: string;
  granularity: 'day' | 'week' | 'month';
  photographerId?: number;
  studioId?: number;
}) {
  return request.get('/api/analytics/trends', { params }) as unknown as Promise<{
    data: Array<{
      date: string;
      type: string;
      value: number;
    }>;
    success: boolean;
  }>;
}

// 获取销售分析数据
export async function getSalesAnalytics(params: {
  startDate: string;
  endDate: string;
  type?: string;
}) {
  return request.get('/api/analytics/sales', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 获取客户分析数据
export async function getCustomerAnalytics(params?: any) {
  return request.get('/api/analytics/customers', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 获取预约分析数据
export async function getBookingAnalytics(params?: any) {
  return request.get('/api/analytics/bookings', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 导出分析数据
export async function exportAnalyticsData(params: {
  type: 'business' | 'sales' | 'customers' | 'bookings';
  startDate: string;
  endDate: string;
  format?: 'csv' | 'xlsx' | 'pdf';
}) {
  return request.post('/api/analytics/export', { ...params, responseType: 'blob' }) as unknown as Promise<Blob>;
}

// 获取摄影师绩效数据
export async function getPhotographerPerformance(params: {
  startDate: string;
  endDate: string;
}) {
  return request.get('/api/analytics/photographers/performance', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}

// 获取套餐销售数据
export async function getPackageSalesData(params: {
  startDate: string;
  endDate: string;
}) {
  return request.get('/api/analytics/packages/sales', { params }) as unknown as Promise<{
    data: any;
    success: boolean;
  }>;
}
