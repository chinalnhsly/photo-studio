import { IsNumber, IsArray } from 'class-validator';

export class UserRoleDto {
  @IsNumber()
  userId: number;

  @IsArray()
  roleIds: number[];
}
