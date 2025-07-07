import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustPointsDto {
  @IsNumber()
  @ApiProperty({ description: '用户ID' })
  memberId: number;  // 改为 memberId 以保持一致性

  @IsNumber()
  @ApiProperty({ description: '调整积分数量（正数为增加，负数为减少）' })
  points: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '调整原因', required: false })
  reason?: string;  // 改为 reason
}
