import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyReviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '回复内容' })
  reply: string;  // 将 content 改为 reply
}
