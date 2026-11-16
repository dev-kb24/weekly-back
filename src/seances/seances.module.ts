import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunningPartie } from './running-partie.entity';
import { Seance } from './seance.entity';
import { SeancesController } from './seances.controller';
import { SeancesService } from './seances.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seance, RunningPartie])],
  controllers: [SeancesController],
  providers: [SeancesService],
})
export class SeancesModule {}
