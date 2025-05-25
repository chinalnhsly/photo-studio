import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      TimeSlot,
      Product
    ])
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService]
})
export class AppointmentModule {}
