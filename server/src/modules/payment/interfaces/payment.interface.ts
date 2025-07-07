export interface PaymentNotifyData {
  tradeNo: string;
  transactionId: string;
  totalAmount: number;
  status: string;
  paidAt: Date;
  rawData?: any;
}

export interface RefundNotifyData {
  refundNo: string;
  refundId: string;
  refundStatus: string;
  refundAmount: number;
  rawData?: any;
}
