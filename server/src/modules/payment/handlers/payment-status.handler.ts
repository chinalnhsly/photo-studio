import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRecord } from '../entities/payment-record.entity';
import { OrderService } from '../../order/order.service';
import { PaymentStatus } from '../entities/payment-record.entity';

@Injectable()
export class PaymentStatusHandler {
  constructor(
    @InjectRepository(PaymentRecord)
    private readonly paymentRepository: Repository<PaymentRecord>,
    private readonly orderService: OrderService,
  ) {}

  async handlePaymentSuccess(payment: PaymentRecord): Promise<void> {
    await Promise.all([
      this.updatePaymentRecord(payment, PaymentStatus.SUCCESS),
      this.orderService.markAsPaid(payment.orderId)
    ]);
  }

  async handlePaymentFailed(payment: PaymentRecord): Promise<void> {
    await this.updatePaymentRecord(payment, PaymentStatus.FAILED);
  }

  private async updatePaymentRecord(
    payment: PaymentRecord, 
    status: PaymentStatus
  ): Promise<void> {
    await this.paymentRepository.update(payment.id, {
      status,
      updatedAt: new Date()
    });
  }
}
