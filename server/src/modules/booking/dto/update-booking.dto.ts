import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../enums/payment-status.enum';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ 
    description: '预约状态', 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    required: false
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'completed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';

  @ApiProperty({ description: '支付状态', enum: PaymentStatus, required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiProperty({ description: '支付金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paymentAmount?: number;

  @ApiProperty({ description: '支付ID', required: false })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiProperty({ description: '支付时间', required: false })
  @IsOptional()
  @IsDateString()
  paymentDate?: Date;

  @ApiProperty({ description: '是否已取消', required: false })
  @IsOptional()
  @IsBoolean()
  isCancelled?: boolean;

  @ApiProperty({ description: '取消时间', required: false })
  @IsOptional()
  @IsDateString()
  cancelledAt?: Date;

  @ApiProperty({ description: '取消原因', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  cancelReason?: string;

  @ApiProperty({ description: '是否未到店', required: false })
  @IsOptional()
  @IsBoolean()
  isNoShow?: boolean;
}
