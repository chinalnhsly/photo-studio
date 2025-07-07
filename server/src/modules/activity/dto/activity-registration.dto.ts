import { IsNumber } from 'class-validator';

export class ActivityRegistrationDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  activity_id: number;
}
