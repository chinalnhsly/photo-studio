export interface PaymentConfig {
  wechat: {
    appId: string;
    mchId: string;
    apiKey: string;
    notifyUrl: string;
  };
}

export const PAYMENT_CONFIG = 'PAYMENT_CONFIG';

export const defaultPaymentConfig: PaymentConfig = {
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    mchId: process.env.WECHAT_MCH_ID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    notifyUrl: process.env.WECHAT_NOTIFY_URL || '',
  },
};
