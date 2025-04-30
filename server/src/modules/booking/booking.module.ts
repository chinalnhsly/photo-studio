import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Studio } from './entities/studio.entity';
import { BookingNote } from './entities/booking-note.entity';
import { Photographer } from '../photographer/entities/photographer.entity';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Studio,
      BookingNote,
      Photographer,
      Product,
      User,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
