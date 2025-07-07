import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewStatusDto {
  @IsString()
  @ApiProperty({ description: '评价状态', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '原因说明（当拒绝时必填）', required: false })
  reason?: string;
}
