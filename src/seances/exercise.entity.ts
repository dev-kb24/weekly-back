import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seance } from './seance.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  sets: number | null;

  @Column({ type: 'int', nullable: true })
  reps: number | null;

  @Column({ type: 'float', nullable: true })
  weight: number | null;

  @ManyToOne(() => Seance, (seance) => seance.exercises, {
    onDelete: 'CASCADE',
  })
  seance: Seance;
}
