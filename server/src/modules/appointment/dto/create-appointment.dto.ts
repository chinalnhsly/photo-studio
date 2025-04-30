import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: '产品ID' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: '预约日期，格式：YYYY-MM-DD' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '时间段ID' })
  @IsString()
  @IsNotEmpty()
  timeSlotId: string;

  @ApiProperty({ description: '客户姓名' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: '客户电话' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remark?: string;
}
