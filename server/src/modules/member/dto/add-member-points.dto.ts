import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberPointsDto {
  @ApiProperty({ description: '积分数量' })
  @IsNotEmpty()
  @IsNumber()
  points: number;
  
  @ApiProperty({ description: '订单ID', required: false })
  @IsOptional()
  @IsNumber()
  orderId?: number;
  
  @ApiProperty({ description: '预约ID', required: false })
  @IsOptional()
  @IsNumber()
  bookingId?: number;
  
  @ApiProperty({ description: '积分变更描述' })
  @IsOptional()
  @IsString()
  description?: string;
  
  @ApiProperty({ description: '操作人ID', required: false })
  @IsOptional()
  @IsNumber()
  operatorId?: number;
}
