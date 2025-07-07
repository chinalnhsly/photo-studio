import { IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CheckAvailabilityDto {
  @IsNumber()
  @ApiProperty({ description: '产品ID' })
  @Transform(({ value }) => Number(value))
  productId: number;

  @IsDateString()
  @ApiProperty({ description: '日期' })
  date: string;

  @IsNumber()
  @ApiProperty({ description: '时间段ID' })
  @Transform(({ value }) => Number(value))
  timeSlotId: number;
}
