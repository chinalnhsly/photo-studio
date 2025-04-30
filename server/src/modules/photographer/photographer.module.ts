import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotographerController } from './photographer.controller';
import { PhotographerService } from './photographer.service';
import { Photographer } from './entities/photographer.entity';
import { PhotographStyle } from './entities/photograph-style.entity';
import { BookingSlot } from '../booking/entities/booking-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Photographer,
      PhotographStyle,
      BookingSlot
    ])
  ],
  controllers: [PhotographerController],
  providers: [PhotographerService],
  exports: [PhotographerService]
})
export class PhotographerModule {}
