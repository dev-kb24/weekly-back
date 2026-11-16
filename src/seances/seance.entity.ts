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
import { RunningPartie } from './running-partie.entity';

@Entity('seances')
export class Seance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ nullable: true, type: 'varchar' })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @ManyToOne(() => User, (user) => user.seances, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: string;

  @OneToMany(() => RunningPartie, (partie) => partie.seance, {
    cascade: true,
    eager: true,
  })
  parties!: RunningPartie[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
