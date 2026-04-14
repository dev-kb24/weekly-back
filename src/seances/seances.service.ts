import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { getWeekRange } from '../common/helpers/week-range.helper';
import { SportType } from './enums/sport-type.enum';
import type { CreateSeanceDto } from './dto/create-seance.dto';
import type { UpdateSeanceDto } from './dto/update-seance.dto';
import { Seance } from './seance.entity';

export interface FindAllFilters {
  week?: string;
  sport?: SportType;
}

@Injectable()
export class SeancesService {
  constructor(
    @InjectRepository(Seance)
    private readonly seanceRepo: Repository<Seance>,
  ) {}

  create(userId: string, dto: CreateSeanceDto): Promise<Seance> {
    const seance = this.seanceRepo.create({ ...dto, userId });
    return this.seanceRepo.save(seance);
  }

  findAll(userId: string, filters: FindAllFilters): Promise<Seance[]> {
    const where: Record<string, unknown> = { userId };

    if (filters.sport) where.sportType = filters.sport;

    if (filters.week) {
      const { startDate, endDate } = getWeekRange(filters.week);
      where.date = Between(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
      );
    }

    return this.seanceRepo.find({ where, order: { date: 'DESC' } });
  }

  async findOne(userId: string, id: string): Promise<Seance> {
    const seance = await this.seanceRepo.findOne({ where: { id } });
    if (!seance) throw new NotFoundException(`Seance ${id} not found`);
    if (seance.userId !== userId) throw new ForbiddenException();
    return seance;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateSeanceDto,
  ): Promise<Seance> {
    const seance = await this.findOne(userId, id);
    const updated = this.seanceRepo.merge(seance, dto);
    return this.seanceRepo.save(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const seance = await this.findOne(userId, id);
    await this.seanceRepo.remove(seance);
  }
}
