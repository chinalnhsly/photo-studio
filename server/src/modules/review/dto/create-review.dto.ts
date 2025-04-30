import { IsNotEmpty, IsOptional, IsNumber, IsString, IsBoolean, IsArray, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: '用户ID' })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '预约ID' })
  @IsNumber()
  bookingId: number;

  @ApiProperty({ description: '摄影师ID', required: false })
  @IsOptional()
  @IsNumber()
  photographerId?: number;

  @ApiProperty({ description: '评分 (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: '评价内容' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: '是否匿名', default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiProperty({ description: '是否推荐', default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;

  @ApiProperty({ description: '评价标签', type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ description: '评价图片URL列表', type: [String], required: false })
  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
