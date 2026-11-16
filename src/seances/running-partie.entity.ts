import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CadenceType, DurationUnit, PartType } from './enums/sport-type.enum';
import { Seance } from './seance.entity';

@Entity('running_parties')
export class RunningPartie {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Seance, (seance) => seance.parties, { onDelete: 'CASCADE' })
  seance!: Seance;

  @Column()
  seanceId!: string;

  @Column({ type: 'int' })
  order!: number;

  @Column({ type: 'enum', enum: PartType })
  type!: PartType;

  @Column({ type: 'enum', enum: DurationUnit })
  durationUnit!: DurationUnit;

  @Column({ type: 'int', nullable: true })
  durationMinutes!: number | null;

  @Column({ type: 'int', nullable: true })
  distanceMeters!: number | null;

  @Column({ type: 'enum', enum: CadenceType })
  cadenceType!: CadenceType;

  @Column({ type: 'int', nullable: true })
  heartRateZone!: number | null;

  @Column({ type: 'int', nullable: true })
  allureMinMin!: number | null;

  @Column({ type: 'int', nullable: true })
  allureMinMax!: number | null;

  @Column({ type: 'int', default: 1 })
  repetitions!: number;

  @Column({ type: 'varchar', nullable: true })
  blockId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
