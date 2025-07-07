export enum CardType {
  STORED_VALUE = 'stored_value',  // 储值卡
  TIMES = 'times',                // 次卡
  PACKAGE = 'package'             // 套餐卡
}

export enum CardStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  FROZEN = 'frozen',
  CANCELLED = 'cancelled'
}
