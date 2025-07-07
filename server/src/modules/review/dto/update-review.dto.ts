import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty({ description: '管理员回复', required: false })
  @IsOptional()
  @IsString()
  adminReply?: string;

  @ApiProperty({ description: '管理员回复时间', required: false })
  @IsOptional()
  @IsDate()
  adminReplyTime?: Date;

  @ApiProperty({ description: '是否公开显示', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
