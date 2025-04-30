import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAvailabilityDto {
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
}
