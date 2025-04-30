import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyReviewDto {
  @ApiProperty({ description: '管理员回复内容' })
  @IsNotEmpty()
  @IsString()
  reply: string;
}
