export interface WechatPayConfig {
  appId: string;
  mchId: string;
  apiKey: string;
  notifyUrl: string;
}

export interface WechatPayOrder {
  outTradeNo: string;
  totalFee: number;
  description: string;
  openid: string;
}

export interface WechatPayResult {
  return_code: string;
  return_msg: string;
  result_code?: string;
  prepay_id?: string;
  code_url?: string;
}
