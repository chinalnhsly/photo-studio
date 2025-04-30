// 营销活动状态
export enum CampaignStatus {
  SCHEDULED = 'scheduled',   // 未开始
  ACTIVE = 'active',         // 进行中
  PAUSED = 'paused',         // 已暂停
  COMPLETED = 'completed',   // 已结束
  EXPIRED = 'expired',       // 已过期
}

// 营销活动类型
export enum CampaignType {
  DISCOUNT = 'discount',     // 折扣
  GIFT = 'gift',             // 赠品
  COUPON = 'coupon',         // 优惠券
  GROUP_BUY = 'groupBuy',    // 团购
  COMBO = 'combo',           // 套餐
  FLASH_SALE = 'flashSale',  // 限时特价
}

// 优惠类型
export enum DiscountType {
  PERCENTAGE = 'percentage', // 百分比折扣
  FIXED = 'fixed',           // 固定金额
  FREE_GIFT = 'free_gift',   // 赠品
  SPECIAL = 'special',       // 特殊优惠
}

// 优惠券类型
export enum CouponType {
  FIXED = 'fixed',           // 固定金额
  PERCENTAGE = 'percentage', // 百分比折扣
  FREE_SHIPPING = 'free_shipping', // 包邮
  FREE_ITEM = 'free_item',   // 免费商品
}

// 活动目标对象类型
export enum TargetType {
  ALL = 'all',               // 所有人
  NEW_CUSTOMER = 'new',      // 新客户
  MEMBER = 'member',         // 会员
  VIP = 'vip',               // VIP会员
  SPECIFIC = 'specific',     // 特定客户
}

// 营销活动接口
export interface Campaign {
  id: number;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  statusText?: string;
  startDate: string;
  endDate: string;
  discountType: DiscountType;
  discountValue?: number;
  discountDescription?: string;
  targetType: TargetType;
  targetIds?: number[];
  minPurchase?: number;
  maxDiscount?: number;
  maxUses?: number;
  usesCount: number;
  participantsCount: number;
  conversionRate: number;
  isHot: boolean;
  isRecommended: boolean;
  description?: string;
  termsConditions?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// 优惠券接口
export interface Coupon {
  id: number;
  campaignId?: number;
  campaign?: Campaign;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'used' | 'expired' | 'inactive';
  isPublic: boolean;
  maxUses: number;
  usesCount: number;
  customerId?: number;
  customer?: {
    id: number;
    name: string;
  };
  productIds?: number[];
  categoryIds?: number[];
  createdAt: string;
  updatedAt: string;
}

// 优惠券使用记录
export interface CouponUsage {
  id: number;
  couponId: number;
  couponCode: string;
  customerId: number;
  customerName: string;
  orderId: number;
  orderNumber: string;
  amount: number;
  discountAmount: number;
  usedAt: string;
}

// 营销活动统计数据
export interface CampaignAnalytics {
  views: number;
  participants: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  ordersCount: number;
  expenses: number;
  roi: number;
  timeStats: Array<{
    date: string;
    views: number;
    participants: number;
    conversions: number;
    revenue: number;
  }>;
}
