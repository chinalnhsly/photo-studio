import { Controller, Post, Get, Body, Param, Query, UseGuards, Req, Res, HttpStatus, Logger, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { WechatPayService } from './providers/wechat-pay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundDto } from './dto/refund.dto';
import { Request, Response } from 'express';
import { User } from '../auth/decorators/user.decorator';
import { xml2js } from 'xml-js';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly wechatPayService: WechatPayService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建支付订单' })
  @ApiResponse({ status: 201, description: '创建成功，返回支付参数' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @User() user) {
    try {
      // 创建支付记录
      const paymentRecord = await this.paymentService.createPayment({
        ...createPaymentDto,
        userId: user.id
      });

      // 根据支付方式调用不同的支付服务
      let paymentParams;
      if (createPaymentDto.paymentMethod === 'wechat') {
        paymentParams = await this.wechatPayService.createOrder({
          outTradeNo: paymentRecord.tradeNo,
          totalFee: Math.round(paymentRecord.amount * 100), // 转换为分
          body: createPaymentDto.description || '影楼服务预约',
          openid: user.openid,
        });
      } else {
        throw new HttpException('不支持的支付方式', HttpStatus.BAD_REQUEST);
      }

      return {
        code: 201,
        message: '创建支付订单成功',
        data: {
          paymentId: paymentRecord.id,
          tradeNo: paymentRecord.tradeNo,
          paymentParams,
        }
      };
    } catch (error) {
      this.logger.error(`创建支付订单失败: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || '创建支付订单失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('wechat/notify')
  @ApiOperation({ summary: '微信支付回调接口' })
  @ApiResponse({ status: 200, description: '处理成功' })
  async wechatPayNotify(@Req() req: Request, @Res() res: Response) {
    try {
      // 获取微信支付的回调通知数据
      let notifyData = '';
      req.on('data', chunk => {
        notifyData += chunk;
      });

      await new Promise((resolve) => {
        req.on('end', resolve);
      });

      // 解析XML数据
      const result = xml2js(notifyData, { compact: true });
      
      // 验证并处理支付回调
      const success = await this.wechatPayService.verifyNotify(result);
      
      if (success) {
        // 更新支付状态
        await this.paymentService.handlePaymentNotify({
          tradeNo: result.xml.out_trade_no._text,
          transactionId: result.xml.transaction_id._text,
          paidAmount: parseInt(result.xml.total_fee._text) / 100,
          paidAt: new Date(),
          rawData: notifyData
        });

        // 返回成功响应
        res.status(200).send(`
          <xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
          </xml>
        `);
      } else {
        this.logger.error('微信支付回调验证失败');
        res.status(200).send(`
          <xml>
            <return_code><![CDATA[FAIL]]></return_code>
            <return_msg><![CDATA[验证失败]]></return_msg>
          </xml>
        `);
      }
    } catch (error) {
      this.logger.error(`处理微信支付回调失败: ${error.message}`, error.stack);
      res.status(200).send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[处理失败]]></return_msg>
        </xml>
      `);
    }
  }

  @Get('status/:tradeNo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查询支付状态' })
  @ApiParam({ name: 'tradeNo', description: '交易号' })
  @ApiResponse({ status: 200, description: '返回支付状态信息' })
  async getPaymentStatus(@Param('tradeNo') tradeNo: string) {
    try {
      const status = await this.paymentService.getPaymentStatus(tradeNo);
      
      return {
        code: 200,
        message: '查询成功',
        data: status
      };
    } catch (error) {
      this.logger.error(`查询支付状态失败: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || '查询支付状态失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '申请退款' })
  @ApiResponse({ status: 200, description: '退款申请已受理' })
  async refund(@Body() refundDto: RefundDto, @User() user) {
    try {
      // 权限检查 - 确认是订单所有者或管理员
      const canRefund = await this.paymentService.verifyRefundPermission(refundDto.tradeNo, user.id);
      
      if (!canRefund) {
        throw new HttpException('无权申请退款', HttpStatus.FORBIDDEN);
      }
      
      // 获取支付记录
      const payment = await this.paymentService.getPaymentByTradeNo(refundDto.tradeNo);
      
      if (!payment) {
        throw new HttpException('订单不存在', HttpStatus.NOT_FOUND);
      }
      
      if (payment.status !== 'paid') {
        throw new HttpException('该订单状态不允许退款', HttpStatus.BAD_REQUEST);
      }
      
      // 创建退款记录
      const refundRecord = await this.paymentService.createRefund({
        tradeNo: payment.tradeNo,
        refundAmount: refundDto.refundAmount,
        refundReason: refundDto.reason,
        userId: user.id
      });
      
      // 调用微信退款接口
      if (payment.paymentMethod === 'wechat') {
        const refundResult = await this.wechatPayService.refund({
          outTradeNo: payment.tradeNo,
          outRefundNo: refundRecord.refundNo,
          totalFee: Math.round(payment.amount * 100),
          refundFee: Math.round(refundDto.refundAmount * 100),
          refundDesc: refundDto.reason || '用户申请退款'
        });
        
        if (refundResult.success) {
          // 更新退款状态
          await this.paymentService.updateRefundStatus(refundRecord.refundNo, 'processing', refundResult.refundId);
        } else {
          throw new HttpException(refundResult.message || '退款请求失败', HttpStatus.BAD_REQUEST);
        }
      }
      
      return {
        code: 200,
        message: '退款申请已受理',
        data: {
          refundNo: refundRecord.refundNo,
          status: 'processing'
        }
      };
    } catch (error) {
      this.logger.error(`申请退款失败: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || '申请退款失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('payment-records')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户支付记录' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false })
  @ApiResponse({ status: 200, description: '返回支付记录列表' })
  async getPaymentRecords(
    @User() user,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const { records, total } = await this.paymentService.getUserPaymentRecords(
        user.id,
        page,
        limit
      );
      
      return {
        code: 200,
        message: '获取成功',
        data: records,
        pagination: {
          total,
          page,
          limit
        }
      };
    } catch (error) {
      this.logger.error(`获取支付记录失败: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || '获取支付记录失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  @Post('wechat/refund-notify')
  @ApiOperation({ summary: '微信退款回调接口' })
  @ApiResponse({ status: 200, description: '处理成功' })
  async wechatRefundNotify(@Req() req: Request, @Res() res: Response) {
    try {
      // 获取微信退款的回调通知数据
      let notifyData = '';
      req.on('data', chunk => {
        notifyData += chunk;
      });

      await new Promise((resolve) => {
        req.on('end', resolve);
      });

      // 解析及解密数据
      const processedData = await this.wechatPayService.decryptRefundNotify(notifyData);
      
      if (processedData) {
        // 更新退款状态
        await this.paymentService.handleRefundNotify({
          refundNo: processedData.out_refund_no,
          refundId: processedData.refund_id,
          refundStatus: processedData.refund_status === 'SUCCESS' ? 'success' : 'failed',
          rawData: notifyData
        });

        // 返回成功响应
        res.status(200).send(`
          <xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
          </xml>
        `);
      } else {
        this.logger.error('微信退款回调处理失败');
        res.status(200).send(`
          <xml>
            <return_code><![CDATA[FAIL]]></return_code>
            <return_msg><![CDATA[处理失败]]></return_msg>
          </xml>
        `);
      }
    } catch (error) {
      this.logger.error(`处理微信退款回调失败: ${error.message}`, error.stack);
      res.status(200).send(`
        <xml>
          <return_code><![CDATA[FAIL]]></return_code>
          <return_msg><![CDATA[处理失败]]></return_msg>
        </xml>
      `);
    }
  }
}
