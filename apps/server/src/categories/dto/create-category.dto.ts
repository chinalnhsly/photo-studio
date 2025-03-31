import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: '婚纱摄影' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '记录最美婚纱照', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
