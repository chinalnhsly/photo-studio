import request from '../utils/request';
import { saveAs } from 'file-saver';

// 获取销售报表数据
export async function getSalesReportData(params: {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
}) {
  return request('/api/reports/sales', {
    method: 'GET',
    params,
  });
}

// 获取销售对比数据
export async function getSalesComparison(params: {
  currentStart: string;
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
}) {
  return request('/api/reports/sales/comparison', {
    method: 'GET',
    params,
  });
}

// 导出销售报表
export async function exportSalesReport(params: {
  startDate: string;
  endDate: string;
  format?: 'excel' | 'csv' | 'pdf';
}) {
  return request('/api/reports/sales/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  }).then(blob => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `销售报表_${timestamp}.${params.format === 'pdf' ? 'pdf' : params.format === 'csv' ? 'csv' : 'xlsx'}`;
    saveAs(blob, filename);
  });
}

// 获取客流量报表
export async function getTrafficReport(params: {
  startDate: string;
  endDate: string;
  groupBy?: 'day' | 'week' | 'month';
}) {
  return request('/api/reports/traffic', {
    method: 'GET',
    params,
  });
}

// 获取摄影师业绩报表
export async function getPhotographerPerformance(params: {
  startDate: string;
  endDate: string;
  photographerId?: number;
}) {
  return request('/api/reports/photographers/performance', {
    method: 'GET',
    params,
  });
}

// 获取商品销售报表
export async function getProductSalesReport(params: {
  startDate: string;
  endDate: string;
  categoryId?: number;
  limit?: number;
}) {
  return request('/api/reports/products/sales', {
    method: 'GET',
    params,
  });
}

// 获取会员消费报表
export async function getMemberConsumptionReport(params: {
  startDate: string;
  endDate: string;
  memberId?: number;
  groupBy?: 'day' | 'week' | 'month';
}) {
  return request('/api/reports/members/consumption', {
    method: 'GET',
    params,
  });
}

// 获取销售预测数据
export async function getSalesForecast(params: {
  startDate: string;
  days: number;
}) {
  return request('/api/reports/sales/forecast', {
    method: 'GET',
    params,
  });
}

// 获取优惠券使用报表
export async function getCouponUsageReport(params: {
  startDate: string;
  endDate: string;
  couponId?: number;
}) {
  return request('/api/reports/coupons/usage', {
    method: 'GET',
    params,
  });
}

// 获取营销活动效果报表
export async function getCampaignEffectivenessReport(params: {
  startDate: string;
  endDate: string;
  campaignId?: number;
}) {
  return request('/api/reports/campaigns/effectiveness', {
    method: 'GET',
    params,
  });
}

// 获取仪表盘概览数据
export async function getDashboardOverview() {
  return request('/api/reports/dashboard/overview', {
    method: 'GET',
  });
}

// 导出订单报表
export async function exportOrderReport(params: {
  startDate: string;
  endDate: string;
  status?: string;
  format?: 'excel' | 'csv' | 'pdf';
}) {
  return request('/api/reports/orders/export', {
    method: 'GET',
    params,
    responseType: 'blob',
  }).then(blob => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `订单报表_${timestamp}.${params.format === 'pdf' ? 'pdf' : params.format === 'csv' ? 'csv' : 'xlsx'}`;
    saveAs(blob, filename);
  });
}

// 获取摄影预约统计
export async function getBookingStatistics(params: {
  startDate: string;
  endDate: string;
  photographerId?: number;
  studioId?: number;
}) {
  return request('/api/reports/bookings/statistics', {
    method: 'GET',
    params,
  });
}

// 获取客户来源分析
export async function getCustomerSourceAnalysis(params: {
  startDate: string;
  endDate: string;
}) {
  return request('/api/reports/customers/sources', {
    method: 'GET',
    params,
  });
}
