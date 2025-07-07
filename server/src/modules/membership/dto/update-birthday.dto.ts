import { IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBirthdayDto {
  @ApiProperty({ description: '生日日期', example: '1990-01-01' })
  @IsNotEmpty()
  @IsDateString()
  birthday: string;
}
