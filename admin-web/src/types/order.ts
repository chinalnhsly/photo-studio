// 订单状态枚举
export enum OrderStatus {
  PENDING = 'PENDING',    // 待支付
  PAID = 'PAID',          // 已支付
  PROCESSING = 'PROCESSING', // 处理中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
  REFUNDED = 'REFUNDED',   // 已退款
}

// 支付方式枚举
export enum PaymentType {
  WECHAT = 'WECHAT',      // 微信支付
  ALIPAY = 'ALIPAY',      // 支付宝
  CASH = 'CASH',          // 现金
  CARD = 'CARD',          // 刷卡
  TRANSFER = 'TRANSFER',  // 银行转账
  STORE_CREDIT = 'STORE_CREDIT', // 店内积分
}

// 订单来源枚举
export enum OrderSource {
  ONLINE = 'ONLINE',      // 线上下单
  OFFLINE = 'OFFLINE',    // 线下录入
  WECHAT = 'WECHAT',      // 微信小程序
  APP = 'APP',            // APP下单
  PHONE = 'PHONE',        // 电话预约
}

// 订单项接口
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  attributes?: Record<string, any>; // 商品属性，如尺寸、颜色等
}

// 订单接口
export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  paymentType?: PaymentType;
  paymentAmount?: number;
  paymentTime?: string;
  orderSource: OrderSource;
  remark?: string;
  discount?: number;
  couponAmount?: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  refundReason?: string;
  shippingAddress?: string;
  shippingMethod?: string;
  trackingNumber?: string;
}

// 订单查询参数接口
export interface OrderQueryParams {
  pageSize?: number;
  current?: number;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentType?: string;
  orderSource?: string;
  sorter?: string;
  getStats?: boolean;
}

// 订单统计信息接口
export interface OrderStats {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  paidOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  todayOrders: number;
  todayAmount: number;
  weekOrders: number;
  weekAmount: number;
  monthOrders: number;
  monthAmount: number;
}
