import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { Seance } from './seance.entity';
import { SeancesController } from './seances.controller';
import { SeancesService } from './seances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seance, Exercise])],
  controllers: [SeancesController],
  providers: [SeancesService],
})
export class SeancesModule {}
