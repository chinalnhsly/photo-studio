export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  REFUND_PENDING = 'refund_pending'
}

export enum PaymentMethod {
  WECHAT = 'wechat',
  ALIPAY = 'alipay',
  CARD = 'card',
  CASH = 'cash'
}

export enum PaymentType {
  ORDER = 'order',
  RECHARGE = 'recharge',
  DEPOSIT = 'deposit'
}
