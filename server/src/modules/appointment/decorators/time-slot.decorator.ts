import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidTimeSlot(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidTimeSlot',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          // 验证时间格式 HH:mm
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return timeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in format HH:mm`;
        }
      }
    });
  };
}
