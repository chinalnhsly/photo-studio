import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './services/booking.service';
import { Booking } from './entities/booking.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { BookingFile } from './entities/booking-file.entity';
import { BookingSlot } from './entities/booking-slot.entity';
import { Photographer } from '../photographer/entities/photographer.entity';
import { StudioModule } from '../studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, TimeSlot, BookingFile, BookingSlot, Photographer]),
    StudioModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService]
})
export class BookingModule {}
