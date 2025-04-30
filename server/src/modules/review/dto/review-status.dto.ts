import { IsNotEmpty, IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewStatusDto {
  @ApiProperty({ description: '评价状态', enum: ['approved', 'rejected'] })
  @IsNotEmpty()
  @IsEnum(['approved', 'rejected'])
  status: string;

  @ApiProperty({ description: '拒绝原因（当状态为rejected时必填）', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}
