import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { WechatPayService } from './providers/wechat-pay.service';
import { PaymentNotifyData, RefundNotifyData } from './interfaces/payment-notify.interface';
import { PaymentStatus, PaymentMethod } from './entities/payment-record.entity';
import { xml2js } from 'xml-js';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly wechatPayService: WechatPayService
  ) {}

  @Post()
  @ApiOperation({ summary: '创建支付记录' })
  async createPayment(@Body() data: {
    orderId: number;
    method: PaymentMethod;
    amount: number;
  }) {
    return this.paymentService.createPaymentRecord(data);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: '获取订单支付记录' })
  async getPaymentsByOrderId(@Param('orderId') orderId: number) {
    return this.paymentService.findByOrderId(orderId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '更新支付状态' })
  async updatePaymentStatus(
    @Param('id') id: number,
    @Body() data: {
      status: PaymentStatus;
      transactionId?: string;
      paymentData?: any;
    }
  ) {
    return this.paymentService.updateStatus(
      id,
      data.status,
      data.transactionId,
      data.paymentData
    );
  }

  @Post('notify/wechat')
  @HttpCode(HttpStatus.OK)
  async handleWechatNotify(@Body() xmlData: string) {
    // 验证通知
    const isValid = await this.wechatPayService.verifyNotify(xmlData);
    if (!isValid) {
      return '<xml><return_code>FAIL</return_code><return_msg>签名校验失败</return_msg></xml>';
    }

    // 解析通知数据
    const result = xml2js(xmlData, { compact: true }) as any;
    if (!result?.xml) {
      return '<xml><return_code>FAIL</return_code><return_msg>数据格式错误</return_msg></xml>';
    }

    // 构造支付通知数据
    const notifyData: PaymentNotifyData = {
      tradeNo: result.xml.out_trade_no._text,
      transactionId: result.xml.transaction_id._text,
      totalAmount: parseInt(result.xml.total_fee._text) / 100,
      status: result.xml.result_code._text === 'SUCCESS' ? 'success' : 'failed',
      paidAt: new Date(),
      rawData: xmlData
    };

    // 处理支付通知
    await this.paymentService.handlePaymentNotify(notifyData);

    return '<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>';
  }

  @Post('notify/wechat/refund')
  @HttpCode(HttpStatus.OK)
  async handleWechatRefundNotify(@Body() encryptedXmlData: string) {
    // 解密退款通知数据
    const decryptedData = await this.wechatPayService.decryptRefundNotify(encryptedXmlData);
    const result = xml2js(decryptedData, { compact: true }) as any;
    
    if (!result?.xml) {
      return '<xml><return_code>FAIL</return_code><return_msg>数据格式错误</return_msg></xml>';
    }

    // 构造退款通知数据
    const notifyData: RefundNotifyData = {
      refundNo: result.xml.out_refund_no._text,
      refundId: result.xml.refund_id._text,
      refundStatus: result.xml.refund_status._text,
      refundAmount: parseInt(result.xml.refund_fee._text) / 100,
      rawData: decryptedData
    };

    // 处理退款通知
    await this.paymentService.handleRefundNotify(notifyData);

    return '<xml><return_code>SUCCESS</return_code><return_msg>OK</return_msg></xml>';
  }
}
