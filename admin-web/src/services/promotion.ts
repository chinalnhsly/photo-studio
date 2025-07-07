import request from '../utils/request';

// 获取营销活动列表
export async function getCampaigns(params?: any) {
  return request('/api/campaigns', {
    method: 'GET',
    params,
  });
}

// 获取单个营销活动
export async function getCampaignById(id: number) {
  return request(`/api/campaigns/${id}`, {
    method: 'GET',
  });
}

// 创建营销活动
export async function createCampaign(data: any) {
  return request('/api/campaigns', {
    method: 'POST',
    data,
  });
}

// 更新营销活动
export async function updateCampaign(id: number, data: any) {
  return request(`/api/campaigns/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除营销活动
export async function deleteCampaign(id: number) {
  return request(`/api/campaigns/${id}`, {
    method: 'DELETE',
  });
}

// 更新营销活动状态
export async function updateCampaignStatus(id: number, isActive: boolean) {
  return request(`/api/campaigns/${id}/status`, {
    method: 'PUT',
    data: { isActive },
  });
}

// 复制营销活动
export async function duplicateCampaign(id: number) {
  return request(`/api/campaigns/${id}/duplicate`, {
    method: 'POST',
  });
}

// 获取活动分析数据
export async function getCampaignAnalytics(id: number, params?: {
  startDate?: string;
  endDate?: string;
}) {
  return request(`/api/campaigns/${id}/analytics`, {
    method: 'GET',
    params,
  });
}

// 获取优惠券列表
export async function getCoupons(params?: any) {
  return request('/api/coupons', {
    method: 'GET',
    params,
  });
}

// 获取单个优惠券
export async function getCouponById(id: number) {
  return request(`/api/coupons/${id}`, {
    method: 'GET',
  });
}

// 创建优惠券
export async function createCoupon(data: any) {
  return request('/api/coupons', {
    method: 'POST',
    data,
  });
}

// 更新优惠券
export async function updateCoupon(id: number, data: any) {
  return request(`/api/coupons/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除优惠券
export async function deleteCoupon(id: number) {
  return request(`/api/coupons/${id}`, {
    method: 'DELETE',
  });
}

// 获取活动优惠券列表
export async function getCampaignCoupons(campaignId: number, params?: any) {
  return request(`/api/campaigns/${campaignId}/coupons`, {
    method: 'GET',
    params,
  });
}

// 生成优惠券码
export async function generateCouponCodes(id: number, quantity: number) {
  return request(`/api/coupons/${id}/generate`, {
    method: 'POST',
    data: { quantity },
  });
}

// 导出优惠券
export async function exportCoupons(id: number) {
  return request(`/api/coupons/${id}/export`, {
    method: 'GET',
    responseType: 'blob',
  });
}

// 获取优惠券使用记录
export async function getCouponUsageRecords(couponId: number, params?: any) {
  return request(`/api/coupons/${couponId}/usage`, {
    method: 'GET',
    params,
  });
}

// 验证优惠券
export async function validateCoupon(code: string) {
  return request('/api/coupons/validate', {
    method: 'POST',
    data: { code },
  });
}
