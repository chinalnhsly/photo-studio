import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  // 继承 CreateMemberDto 的所有属性，但都是可选的
}
