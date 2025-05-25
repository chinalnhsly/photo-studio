import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @IsString()
  @ApiProperty({ description: '轮播图标题' })
  title: string;

  @IsString()
  @ApiProperty({ description: '图片URL' })
  imageUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '链接地址', required: false })
  linkUrl?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '显示顺序', required: false, default: 0 })
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '是否激活', required: false, default: true })
  isActive?: boolean;
}
