import { PartialType } from '@nestjs/swagger';
import { CreatePhotographerDto } from './create-photographer.dto';

export class UpdatePhotographerDto extends PartialType(CreatePhotographerDto) {}
