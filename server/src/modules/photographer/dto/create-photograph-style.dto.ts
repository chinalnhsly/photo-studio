import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建摄影风格DTO
 * 用于定义新建摄影风格时的数据结构和验证规则
 */
export class CreatePhotographStyleDto {
  @ApiProperty({ description: '风格名称', example: '婚纱写真' })
  @IsNotEmpty({ message: '风格名称不能为空' })
  @IsString({ message: '风格名称必须是字符串' })
  name: string;

  @ApiProperty({ 
    description: '风格描述', 
    required: false,
    example: '采用自然光线和优美的自然景观作为背景的婚纱摄影风格'
  })
  @IsOptional()
  @IsString({ message: '风格描述必须是字符串' })
  description?: string;

  @ApiProperty({ 
    description: '风格图标', 
    required: false,
    example: 'wedding-icon.png'
  })
  @IsOptional()
  @IsString({ message: '风格图标必须是字符串' })
  icon?: string;

  @ApiProperty({ 
    description: '排序序号，数字越小越靠前', 
    required: false,
    example: 10
  })
  @IsOptional()
  @IsNumber({}, { message: '排序序号必须是数字' })
  @Min(0, { message: '排序序号必须大于或等于0' })
  sortOrder?: number;
}
