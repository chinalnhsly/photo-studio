import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'timeSlotValidator', async: false })
export class TimeSlotValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) return false;
    
    const startTime = moment(value.startTime, 'HH:mm');
    const endTime = moment(value.endTime, 'HH:mm');
    
    // 验证时间格式和顺序
    return startTime.isValid() && 
           endTime.isValid() && 
           endTime.isAfter(startTime);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid time slot format or range';
  }
}
