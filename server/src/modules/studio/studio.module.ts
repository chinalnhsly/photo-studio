import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Studio } from './entities/studio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Studio])],
  exports: [TypeOrmModule],
})
export class StudioModule {}
