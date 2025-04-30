import { IsNotEmpty, IsArray, IsString, MaxLength, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchReplyDto {
  @ApiProperty({ description: '评价ID数组', type: [Number] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  reviewIds: number[];

  @ApiProperty({ description: '回复内容', maxLength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  reply: string;
}
