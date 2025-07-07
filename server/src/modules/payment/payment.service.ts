import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRecord, PaymentStatus, PaymentMethod } from './entities/payment-record.entity';
import { PaymentNotifyData, RefundNotifyData } from './interfaces/payment-notify.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  
  constructor(
    @InjectRepository(PaymentRecord)
    private paymentRepository: Repository<PaymentRecord>,
  ) {}

  async createPaymentRecord(data: {
    orderId: number;
    method: PaymentMethod;
    amount: number;
    tradeNo?: string; // 添加商户订单号
  }): Promise<PaymentRecord> {
    const payment = this.paymentRepository.create({
      orderId: data.orderId,
      method: data.method,
      amount: data.amount,
      status: PaymentStatus.PENDING,
      tradeNo: data.tradeNo, // 存储商户订单号
    });

    return this.paymentRepository.save(payment);
  }

  async findByOrderId(orderId: number): Promise<PaymentRecord[]> {
    return this.paymentRepository.find({
      where: { orderId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 更新支付记录状态
   */
  async updateStatus(
    id: number, 
    status: PaymentStatus, 
    transactionId?: string, 
    paymentData?: any
  ): Promise<PaymentRecord> {
    const payment = await this.paymentRepository.findOne({
      where: { id }
    });
    
    if (!payment) {
      throw new NotFoundException(`支付记录 ID ${id} 不存在`);
    }
    
    payment.status = status;
    
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    
    if (paymentData) {
      payment.paymentData = paymentData;
    }
    
    return this.paymentRepository.save(payment);
  }

  /**
   * 处理支付通知
   * @param notifyData 支付通知数据
   */
  async handlePaymentNotify(notifyData: PaymentNotifyData): Promise<void> {
    this.logger.log(`处理支付通知: ${JSON.stringify(notifyData)}`);
    
    try {
      // 根据商户订单号查找支付记录
      const payment = await this.paymentRepository.findOne({
        where: { tradeNo: notifyData.tradeNo }
      });

      if (!payment) {
        throw new NotFoundException(`未找到商户订单号为 ${notifyData.tradeNo} 的支付记录`);
      }

      // 更新支付状态
      const newStatus = notifyData.status === 'success' 
        ? PaymentStatus.SUCCESS 
        : PaymentStatus.FAILED;
        
      await this.updateStatus(
        payment.id,
        newStatus,
        notifyData.transactionId,
        notifyData.rawData
      );
      
      this.logger.log(`支付记录 ${payment.id} 状态更新为 ${newStatus}`);
      
      // 这里可以添加更新订单状态的逻辑，或发布支付成功事件
    } catch (error) {
      this.logger.error(`处理支付通知失败: ${error.message}`);
      throw error;
    }
  }

  /**
   * 处理退款通知
   * @param notifyData 退款通知数据
   */
  async handleRefundNotify(notifyData: RefundNotifyData): Promise<void> {
    this.logger.log(`处理退款通知: ${JSON.stringify(notifyData)}`);
    
    try {
      // 根据退款单号查找支付记录
      // 实际业务中，可能需要添加额外的字段来存储退款单号
      const payment = await this.paymentRepository.findOne({
        where: { refundNo: notifyData.refundNo }
      });

      if (!payment) {
        throw new NotFoundException(`未找到退款单号为 ${notifyData.refundNo} 的支付记录`);
      }

      // 更新为退款状态
      if (notifyData.refundStatus === 'SUCCESS') {
        await this.updateStatus(
          payment.id,
          PaymentStatus.REFUNDED,
          null,
          notifyData.rawData
        );
        
        this.logger.log(`支付记录 ${payment.id} 已成功退款`);
      }
      
      // 这里可以添加更新订单状态的逻辑，或发布退款成功事件
    } catch (error) {
      this.logger.error(`处理退款通知失败: ${error.message}`);
      throw error;
    }
  }
}
