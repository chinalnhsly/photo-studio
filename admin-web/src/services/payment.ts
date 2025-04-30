import { message } from 'antd';
import request from '../utils/request';

// 支付状态枚举
export enum PaymentStatus {
  PENDING = 'pending',    // 待支付
  PROCESSING = 'processing', // 处理中
  SUCCESS = 'success',    // 支付成功
  FAILED = 'failed',      // 支付失败
  CANCELLED = 'cancelled', // 已取消
  REFUNDED = 'refunded',  // 已退款
}

// 支付方式枚举
export enum PaymentMethod {
  WECHAT = 'wechat',      // 微信支付
  ALIPAY = 'alipay',      // 支付宝
  CASH = 'cash',          // 现金
  CARD = 'card',          // 刷卡
  TRANSFER = 'transfer',  // 转账
}

// 支付相关接口
export interface PaymentInfo {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
  qrCodeUrl?: string;
  remark?: string;
}

// 创建支付请求参数
export interface CreatePaymentParams {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  callbackUrl?: string;
  remark?: string;
}

// 支付结果查询参数
export interface QueryPaymentParams {
  paymentId: string;
  orderId?: string;
}

// 支付服务
const paymentService = {
  // 创建支付
  async createPayment(params: CreatePaymentParams): Promise<PaymentInfo> {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟支付响应数据
      const response = {
        id: `PAY${Date.now()}`,
        orderId: params.orderId,
        amount: params.amount,
        status: PaymentStatus.PENDING,
        method: params.method,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        qrCodeUrl: params.method === PaymentMethod.WECHAT || params.method === PaymentMethod.ALIPAY 
          ? 'https://placeholder.com/qrcode' 
          : undefined,
        remark: params.remark,
      };
      
      return response;
    } catch (error) {
      message.error('创建支付失败');
      throw error;
    }
  },
  
  // 查询支付状态
  async queryPayment(params: QueryPaymentParams): Promise<PaymentInfo> {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟支付状态查询响应
      const response = {
        id: params.paymentId,
        orderId: params.orderId || `ORDER${Date.now()}`,
        amount: 1000,
        status: PaymentStatus.SUCCESS,
        method: PaymentMethod.WECHAT,
        createdAt: new Date(Date.now() - 300000).toISOString(),
        updatedAt: new Date().toISOString(),
        transactionId: `TX${Date.now()}`,
      };
      
      return response;
    } catch (error) {
      message.error('查询支付状态失败');
      throw error;
    }
  },
  
  // 取消支付
  async cancelPayment(paymentId: string): Promise<boolean> {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      message.error('取消支付失败');
      throw error;
    }
  },
  
  // 退款
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<boolean> {
    try {
      // 模拟请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      message.error('退款失败');
      throw error;
    }
  }
};

export default paymentService;
