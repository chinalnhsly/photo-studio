import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { BookingFile } from '../entities/booking-file.entity';
import { BookingSlot } from '../entities/booking-slot.entity';
import { TimeSlot } from '../entities/time-slot.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingFile)
    private bookingFileRepository: Repository<BookingFile>,
    @InjectRepository(BookingSlot)
    private bookingSlotRepository: Repository<BookingSlot>,
    @InjectRepository(TimeSlot)
    private timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['photographer', 'product', 'user', 'files', 'slot', 'timeSlot'],
    });
  }

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    const booking = this.bookingRepository.create(bookingData);
    return this.bookingRepository.save(booking);
  }

  async update(id: number, bookingData: Partial<Booking>): Promise<Booking> {
    await this.bookingRepository.update(id, bookingData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}
