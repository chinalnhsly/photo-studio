import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { RedisService } from '../redis/redis.service';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { js2xml } from 'xml-js';

@Injectable()
export class WechatPayService {
  private readonly logger = new Logger(WechatPayService.name);
  private readonly wechatPayConfig: any;
  private readonly apiEndpoints = {
    unifiedOrder: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    orderQuery: 'https://api.mch.weixin.qq.com/pay/orderquery',
    refund: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
    refundQuery: 'https://api.mch.weixin.qq.com/pay/refundquery',
  };

  constructor(
    @Inject('PAYMENT_CONFIG') private readonly paymentConfig,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {
    this.wechatPayConfig = this.paymentConfig.wechat;
    this.logger.log('WechatPayService initialized');
  }

  /**
   * 创建微信支付订单
   * @param orderData 订单数据
   * @returns 支付参数
   */
  async createOrder(orderData: {
    outTradeNo: string;      // 商户订单号
    totalFee: number;        // 支付金额(分)
    body: string;            // 商品描述
    openid: string;          // 用户openid
    attach?: string;         // 附加数据
    timeExpire?: string;     // 过期时间
  }) {
    try {
      this.logger.log(`Creating wechat payment order: ${orderData.outTradeNo}`);

      // 检查参数
      if (!orderData.outTradeNo || !orderData.totalFee || !orderData.body || !orderData.openid) {
        throw new HttpException('订单参数不完整', HttpStatus.BAD_REQUEST);
      }

      // 构建统一下单请求参数
      const nonceStr = this.generateNonceStr();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      const requestData = {
        appid: this.wechatPayConfig.appId,
        mch_id: this.wechatPayConfig.mchId,
        nonce_str: nonceStr,
        body: orderData.body,
        out_trade_no: orderData.outTradeNo,
        total_fee: orderData.totalFee,
        spbill_create_ip: '127.0.0.1', // 客户端IP，这里可以根据实际情况获取
        notify_url: this.wechatPayConfig.notifyUrl,
        trade_type: 'JSAPI', // 小程序支付
        openid: orderData.openid,
        attach: orderData.attach || '',
        time_expire: orderData.timeExpire || this.getExpireTime(),
      };

      // 生成签名
      const sign = this.generateSign(requestData);
      const xmlData = this.jsonToXml({
        ...requestData,
        sign,
      });

      // 发送请求
      const response = await firstValueFrom(
        this.httpService.post(this.apiEndpoints.unifiedOrder, xmlData, {
          headers: { 'Content-Type': 'text/xml' },
        })
      );

      // 解析响应
      const result = await this.parseXml(response.data);
      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        // 生成小程序支付参数
        const payParams = {
          appId: this.wechatPayConfig.appId,
          timeStamp: timestamp,
          nonceStr,
          package: `prepay_id=${result.prepay_id}`,
          signType: 'MD5',
        };
        
        // 为小程序支付参数生成签名
        const paySign = this.generateSign(payParams);

        // 记录订单创建信息到Redis，用于后续校验
        await this.redisService.set(
          `wechatpay:order:${orderData.outTradeNo}`,
          JSON.stringify({
            createdAt: new Date().toISOString(),
            totalFee: orderData.totalFee,
            prepayId: result.prepay_id,
          }),
          60 * 30 // 30分钟过期
        );

        return {
          ...payParams,
          paySign,
          orderId: orderData.outTradeNo,
        };
      } else {
        this.logger.error(`Failed to create wechat payment: ${result.return_msg || result.err_code_des}`);
        throw new HttpException(
          result.return_msg || result.err_code_des || '创建支付订单失败',
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      this.logger.error(`Error creating wechat payment: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || '创建支付订单失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 验证支付回调通知
   * @param notifyData 微信通知数据
   * @returns 验证是否成功
   */
  async verifyNotify(notifyData: any) {
    try {
      const result = notifyData.xml;
      
      // 基本验证
      if (!result || result.return_code._text !== 'SUCCESS') {
        this.logger.error('Invalid notification data');
        return false;
      }

      // 从Redis获取订单信息
      const orderKey = `wechatpay:order:${result.out_trade_no._text}`;
      const orderInfo = await this.redisService.get(orderKey);
      if (!orderInfo) {
        this.logger.error(`Order not found in cache: ${result.out_trade_no._text}`);
        return false;
      }

      const order = JSON.parse(orderInfo);

      // 检查金额是否一致
      if (parseInt(result.total_fee._text) !== order.totalFee) {
        this.logger.error(`Amount mismatch: expected ${order.totalFee}, got ${result.total_fee._text}`);
        return false;
      }

      // 验证签名
      const signData = { ...result };
      delete signData.sign;
      
      // 将数据平铺成普通对象
      const flatData = {};
      Object.keys(signData).forEach(key => {
        if (key !== 'sign') {
          flatData[key] = signData[key]._text;
        }
      });

      const sign = this.generateSign(flatData);
      if (sign !== result.sign._text) {
        this.logger.error('Signature verification failed');
        return false;
      }

      // 记录支付成功
      await this.redisService.set(
        `wechatpay:paid:${result.out_trade_no._text}`,
        JSON.stringify({
          paidAt: new Date().toISOString(),
          transactionId: result.transaction_id._text,
          totalFee: parseInt(result.total_fee._text),
          openid: result.openid._text,
        }),
        60 * 60 * 24 * 7 // 保留7天
      );

      return true;
    } catch (error) {
      this.logger.error(`Error verifying notify: ${error.message}`, error.stack);
      return false;
    }
  }

  /**
   * 申请退款
   * @param refundData 退款数据
   * @returns 退款结果
   */
  async refund(refundData: {
    outTradeNo: string;      // 商户订单号
    outRefundNo: string;     // 商户退款单号
    totalFee: number;        // 订单总金额(分)
    refundFee: number;       // 退款金额(分)
    refundDesc?: string;     // 退款原因
  }) {
    try {
      this.logger.log(`Processing refund request: ${refundData.outRefundNo}`);

      // 检查参数
      if (!refundData.outTradeNo || !refundData.outRefundNo || !refundData.totalFee || !refundData.refundFee) {
        throw new HttpException('退款参数不完整', HttpStatus.BAD_REQUEST);
      }

      // 构建退款请求参数
      const nonceStr = this.generateNonceStr();
      const requestData = {
        appid: this.wechatPayConfig.appId,
        mch_id: this.wechatPayConfig.mchId,
        nonce_str: nonceStr,
        out_trade_no: refundData.outTradeNo,
        out_refund_no: refundData.outRefundNo,
        total_fee: refundData.totalFee,
        refund_fee: refundData.refundFee,
        notify_url: this.wechatPayConfig.refundNotifyUrl,
        refund_desc: refundData.refundDesc || '商品退款',
      };

      // 生成签名
      const sign = this.generateSign(requestData);
      const xmlData = this.jsonToXml({
        ...requestData,
        sign,
      });

      // 读取证书
      const cert = fs.readFileSync(this.wechatPayConfig.pfx);

      // 发送请求
      const response = await firstValueFrom(
        this.httpService.post(this.apiEndpoints.refund, xmlData, {
          headers: { 'Content-Type': 'text/xml' },
          httpsAgent: new (require('https').Agent)({
            pfx: cert,
            passphrase: this.wechatPayConfig.mchId,
          }),
        })
      );

      // 解析响应
      const result = await this.parseXml(response.data);
      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        // 记录退款信息到Redis
        await this.redisService.set(
          `wechatpay:refund:${refundData.outRefundNo}`,
          JSON.stringify({
            createdAt: new Date().toISOString(),
            outTradeNo: refundData.outTradeNo,
            refundFee: refundData.refundFee,
            refundId: result.refund_id,
            status: 'processing'
          }),
          60 * 60 * 24 * 7 // 保留7天
        );

        return {
          success: true,
          refundId: result.refund_id,
          outRefundNo: result.out_refund_no,
        };
      } else {
        this.logger.error(`Failed to process refund: ${result.return_msg || result.err_code_des}`);
        return {
          success: false,
          message: result.return_msg || result.err_code_des || '申请退款失败',
        };
      }
    } catch (error) {
      this.logger.error(`Error processing refund: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || '退款处理发生错误',
      };
    }
  }

  /**
   * 解密退款通知数据
   * @param xmlData 加密的XML数据
   * @returns 解密后的数据对象
   */
  async decryptRefundNotify(xmlData: string) {
    try {
      // 解析XML
      const result = await this.parseXml(xmlData);
      if (result.return_code !== 'SUCCESS') {
        this.logger.error(`Invalid refund notification: ${result.return_msg}`);
        return null;
      }

      // 获取加密数据
      const reqInfo = result.req_info;
      if (!reqInfo) {
        this.logger.error('Missing req_info in refund notification');
        return null;
      }

      // 对商户Key做MD5，得到32位小写key
      const md5Key = createHash('md5')
        .update(this.wechatPayConfig.apiKey)
        .digest('hex')
        .toLowerCase();

      // 解密
      const decipher = createDecipheriv('aes-256-ecb', md5Key, '');
      let decrypted = decipher.update(reqInfo, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // 解析解密后的XML
      const decryptedData = await this.parseXml(decrypted);

      return decryptedData;
    } catch (error) {
      this.logger.error(`Error decrypting refund notify: ${error.message}`, error.stack);
      return null;
    }
  }

  /**
   * 查询订单状态
   * @param outTradeNo 商户订单号
   * @returns 订单状态
   */
  async queryOrder(outTradeNo: string) {
    try {
      this.logger.log(`Querying order status: ${outTradeNo}`);

      // 构建查询请求参数
      const nonceStr = this.generateNonceStr();
      const requestData = {
        appid: this.wechatPayConfig.appId,
        mch_id: this.wechatPayConfig.mchId,
        out_trade_no: outTradeNo,
        nonce_str: nonceStr,
      };

      // 生成签名
      const sign = this.generateSign(requestData);
      const xmlData = this.jsonToXml({
        ...requestData,
        sign,
      });

      // 发送请求
      const response = await firstValueFrom(
        this.httpService.post(this.apiEndpoints.orderQuery, xmlData, {
          headers: { 'Content-Type': 'text/xml' },
        })
      );

      // 解析响应
      const result = await this.parseXml(response.data);
      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        return {
          success: true,
          outTradeNo: result.out_trade_no,
          transactionId: result.transaction_id,
          tradeState: result.trade_state, // SUCCESS：支付成功，其他状态参考微信文档
          tradeStateDesc: result.trade_state_desc,
          totalFee: parseInt(result.total_fee),
          timeEnd: result.time_end, // 支付完成时间，格式为yyyyMMddHHmmss
        };
      } else {
        this.logger.error(`Failed to query order: ${result.return_msg || result.err_code_des}`);
        return {
          success: false,
          message: result.return_msg || result.err_code_des || '查询订单失败',
        };
      }
    } catch (error) {
      this.logger.error(`Error querying order: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || '查询订单发生错误',
      };
    }
  }

  /**
   * 生成随机字符串
   */
  private generateNonceStr(length: number = 32): string {
    return uuidv4().replace(/-/g, '');
  }

  /**
   * 生成微信支付签名
   * @param params 参数对象
   * @returns 生成的签名
   */
  private generateSign(params: any): string {
    // 按字典序排序参数
    const sortedParams = {};
    Object.keys(params)
      .sort()
      .forEach(key => {
        if (params[key] !== undefined && params[key] !== '' && key !== 'sign') {
          sortedParams[key] = params[key];
        }
      });

    // 拼接字符串
    let signStr = '';
    Object.keys(sortedParams).forEach(key => {
      signStr += `${key}=${sortedParams[key]}&`;
    });
    signStr += `key=${this.wechatPayConfig.apiKey}`;

    // MD5签名并转大写
    return createHash('md5')
      .update(signStr)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * 将JSON对象转换为XML
   * @param json JSON对象
   * @returns XML字符串
   */
  private jsonToXml(json: any): string {
    const builder = new xml2js.Builder({
      rootName: 'xml',
      cdata: true,
      headless: true,
    });
    return builder.buildObject(json);
  }

  /**
   * 解析XML字符串为JSON对象
   * @param xml XML字符串
   * @returns JSON对象
   */
  private async parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(
        xml,
        { trim: true, explicitArray: false },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.xml);
          }
        }
      );
    });
  }

  /**
   * 获取过期时间
   * @returns 过期时间字符串，格式：yyyyMMddHHmmss
   */
  private getExpireTime(): string {
    const date = new Date();
    date.setHours(date.getHours() + 2); // 2小时后过期
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
}
