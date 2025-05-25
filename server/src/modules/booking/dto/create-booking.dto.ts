import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: '用户ID' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '产品ID', required: false })
  @IsNumber()
  @IsOptional()
  productId?: number;

  @ApiProperty({ description: '时间段ID' })
  @IsNumber()
  @IsNotEmpty()
  timeSlotId: number;

  @ApiProperty({ description: '预约日期', example: '2023-05-20' })
  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ description: '联系人姓名' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
