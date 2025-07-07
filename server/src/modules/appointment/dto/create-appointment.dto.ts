import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @IsNumber()
  @ApiProperty({ description: '产品ID' })
  productId: number;

  @IsDateString()
  @ApiProperty({ description: '预约日期' })
  date: string;

  @IsNumber()
  @ApiProperty({ description: '时间槽ID' })
  timeSlotId: number;

  @IsString()
  @ApiProperty({ description: '客户姓名' })
  customerName: string;

  @IsString()
  @ApiProperty({ description: '客户电话' })
  customerPhone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '备注', required: false })
  remark?: string;
}
