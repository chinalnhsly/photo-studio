import  request  from 'umi-request';

// 优惠券接口定义
export interface Coupon {
  id: number;
  name: string;
  type: 'fixed' | 'percentage';
  value: number;
  minPurchase?: number;
  startDate?: string;
  endDate?: string;
  totalCodes: number;
  usedCodes: number;
  isActive: boolean;
  code?: string;
  createdAt: string;
  statusText?: string;
}

// 生成优惠券码参数
export interface GenerateCodeParams {
  couponId: number;
  quantity: number;
  prefix?: string;
  length?: number;
  expireDate?: string;
}

// 查询优惠券列表
export async function getCoupons(params: any) {
  return request('/api/coupons', {
    method: 'GET',
    params,
  });
}

// 删除优惠券
export async function deleteCoupon(id: number) {
  return request(`/api/coupons/${id}`, {
    method: 'DELETE',
  });
}

// 更新优惠券状态
export async function updateCouponStatus(id: number, isActive: boolean) {
  return request(`/api/coupons/${id}/status`, {
    method: 'PATCH',
    data: { isActive },
  });
}

// 生成优惠券码
export async function generateCouponCodes(params: GenerateCodeParams) {
  return request('/api/coupon-codes/generate', {
    method: 'POST',
    data: params,
  });
}
