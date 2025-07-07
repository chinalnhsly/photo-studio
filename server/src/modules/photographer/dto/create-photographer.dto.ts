import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsNumber, 
  Min, 
  Max, 
  IsBoolean,
  IsArray
} from 'class-validator';

export class CreatePhotographerDto {
  @ApiProperty({ example: '张摄影', description: '摄影师名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ 
    example: '资深人像摄影师，擅长婚纱和儿童照片拍摄',
    description: '个人简介' 
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ 
    example: '资深人像摄影师，擅长婚纱和儿童照片拍摄，拥有10年摄影经验...',
    description: '详细传记' 
  })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: '头像URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: '婚纱, 儿童, 风景', description: '擅长风格' })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ example: 5, description: '工作经验（年）' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  experience?: number;

  @ApiProperty({ example: 4.5, description: '评分', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: '13800138000', description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'photographer@example.com', description: '电子邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: true, description: '是否接单', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  @ApiProperty({ 
    example: ['人像摄影', '婚纱摄影'],  
    description: '专长领域',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  specialties?: string[];
  
  @ApiProperty({ 
    example: ['https://example.com/portfolio1.jpg'],
    description: '作品集图片',
    type: [String] 
  })
  @IsOptional()
  @IsArray()
  portfolioImages?: string[];
  
  @ApiProperty({ 
    example: ['佳能 5D4', '24-70mm 镜头'], 
    description: '使用设备', 
    type: [String] 
  })
  @IsOptional()
  @IsArray()
  equipments?: string[];
  
  @ApiProperty({ example: '中文, 英文', description: '擅长语言' })
  @IsOptional()
  @IsString()
  languagesSpoken?: string;
  
  @ApiProperty({ example: false, description: '是否接受加急工作' })
  @IsOptional()
  @IsBoolean()
  acceptsRushJobs?: boolean;
}
