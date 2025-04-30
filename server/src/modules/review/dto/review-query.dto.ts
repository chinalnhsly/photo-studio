import { IsOptional, IsInt, IsString, IsBoolean, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  pageSize?: number = 10;

  @ApiProperty({ description: '评分筛选', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  rating?: number;

  @ApiProperty({ description: '商品名称', required: false })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({ description: '是否有图', required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  hasImages?: boolean;

  @ApiProperty({ 
    description: '状态筛选', 
    required: false, 
    enum: ['all', 'replied', 'unreplied'] 
  })
  @IsOptional()
  @IsEnum(['all', 'replied', 'unreplied'])
  status?: string = 'all';

  @ApiProperty({ description: '排序字段', required: false, default: 'createdAt' })
  @IsOptional()
  @IsString()
  sortField?: string = 'createdAt';

  @ApiProperty({ description: '排序方向', required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
