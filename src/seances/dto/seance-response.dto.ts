import { Expose, Type } from 'class-transformer';
import type { RunningPartie } from '../running-partie.entity';
import type { Seance } from '../seance.entity';
import { CadenceType, DurationUnit, PartType } from '../enums/sport-type.enum';

export class RunningPartieResponseDto {
  @Expose()
  id!: string;

  @Expose()
  order!: number;

  @Expose()
  type!: PartType;

  @Expose()
  durationUnit!: DurationUnit;

  @Expose()
  durationMinutes!: number | null;

  @Expose()
  distanceKm!: number | null;

  @Expose()
  cadenceType!: CadenceType;

  @Expose()
  heartRateZone!: number | null;

  @Expose()
  allureMinMin!: number | null;

  @Expose()
  allureMinMax!: number | null;

  @Expose()
  repetitions!: number;

  @Expose()
  blockId!: string | null;

  constructor(entity: RunningPartie) {
    this.id = entity.id;
    this.order = entity.order;
    this.type = entity.type;
    this.durationUnit = entity.durationUnit;
    this.durationMinutes = entity.durationMinutes;
    this.distanceKm = entity.distanceMeters != null ? entity.distanceMeters / 1000 : null;
    this.cadenceType = entity.cadenceType;
    this.heartRateZone = entity.heartRateZone;
    this.allureMinMin = entity.allureMinMin;
    this.allureMinMax = entity.allureMinMax;
    this.repetitions = entity.repetitions;
    this.blockId = entity.blockId;
  }
}

export class SeanceResponseDto {
  @Expose()
  id!: string;

  @Expose()
  date!: string;

  @Expose()
  title!: string | null;

  @Expose()
  notes!: string | null;

  @Expose()
  @Type(() => RunningPartieResponseDto)
  parties!: RunningPartieResponseDto[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  constructor(entity: Seance) {
    this.id = entity.id;
    this.date = entity.date;
    this.title = entity.title;
    this.notes = entity.notes;
    this.parties = entity.parties.map((p) => new RunningPartieResponseDto(p));
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
