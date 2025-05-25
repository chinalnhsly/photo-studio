import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchReplyDto {
  @IsArray()
  @ApiProperty({ description: '评价ID列表' })
  reviewIds: number[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '回复内容' })
  reply: string;
}
