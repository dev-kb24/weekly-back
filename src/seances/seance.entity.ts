import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exercise } from './exercise.entity';
import { SportType } from './enums/sport-type.enum';

@Entity('seances')
export class Seance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: SportType })
  sportType: SportType;

  @Column({ nullable: true, type: 'varchar' })
  seanceType: string | null;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'float', nullable: true })
  distance: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Running specific
  @Column({ type: 'float', nullable: true })
  allure: number | null;

  @Column({ type: 'int', nullable: true })
  heartRate: number | null;

  // Cycling specific
  @Column({ type: 'int', nullable: true })
  elevation: number | null;

  @ManyToOne(() => User, (user) => user.seances, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Exercise, (exercise) => exercise.seance, {
    cascade: true,
    eager: true,
  })
  exercises: Exercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
