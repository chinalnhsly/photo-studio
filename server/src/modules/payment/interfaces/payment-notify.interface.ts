/**
 * 支付通知数据接口
 */
export interface PaymentNotifyData {
  /**
   * 商户订单号
   */
  tradeNo: string;
  
  /**
   * 支付平台交易号
   */
  transactionId: string;
  
  /**
   * 支付金额 (元)
   */
  totalAmount: number;
  
  /**
   * 支付状态
   */
  status: 'success' | 'failed';
  
  /**
   * 支付时间
   */
  paidAt: Date;
  
  /**
   * 原始通知数据
   */
  rawData: any;
}

/**
 * 退款通知数据接口
 */
export interface RefundNotifyData {
  /**
   * 商户退款单号
   */
  refundNo: string;
  
  /**
   * 支付平台退款单号
   */
  refundId: string;
  
  /**
   * 退款状态
   */
  refundStatus: string;
  
  /**
   * 退款金额 (元)
   */
  refundAmount: number;
  
  /**
   * 原始通知数据
   */
  rawData: any;
}
