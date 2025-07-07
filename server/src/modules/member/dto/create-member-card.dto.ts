import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberCardDto {
  @IsString()
  @ApiProperty({ description: '卡号' })
  cardNumber: string;

  @IsNumber()
  @ApiProperty({ description: '初始余额' })
  balance: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '备注', required: false })
  remark?: string;
}
