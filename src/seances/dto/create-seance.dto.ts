import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  CyclingSeanceType,
  RunningSeanceType,
  SportType,
} from '../enums/sport-type.enum';

export class ExerciseDto {
  @ApiProperty({ example: 'Squat' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  sets?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  reps?: number;

  @ApiPropertyOptional({ example: 60.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;
}

export class CreateSeanceDto {
  @ApiProperty({ example: '2026-04-14' })
  @IsISO8601({ strict: true })
  date!: string;

  @ApiProperty({ enum: SportType })
  @IsEnum(SportType)
  sportType!: SportType;

  @ApiPropertyOptional({
    example: 'EF',
    description: `Running: ${Object.values(RunningSeanceType).join(' | ')} — Cycling: ${Object.values(CyclingSeanceType).join(' | ')}`,
  })
  @IsOptional()
  @IsString()
  seanceType?: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiPropertyOptional({ example: 10.5, description: 'Distance in km' })
  @ValidateIf((o: CreateSeanceDto) =>
    [SportType.RUNNING, SportType.CYCLING, SportType.NATATION].includes(
      o.sportType,
    ),
  )
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number;

  @ApiPropertyOptional({ example: 'Felt great' })
  @IsOptional()
  @IsString()
  notes?: string;

  // Running specific
  @ApiPropertyOptional({ example: 5.3, description: 'Pace in min/km' })
  @ValidateIf((o: CreateSeanceDto) => o.sportType === SportType.RUNNING)
  @IsOptional()
  @IsNumber()
  @Min(0)
  allure?: number;

  @ApiPropertyOptional({ example: 145, description: 'Heart rate in bpm' })
  @ValidateIf((o: CreateSeanceDto) => o.sportType === SportType.RUNNING)
  @IsOptional()
  @IsInt()
  @Min(0)
  heartRate?: number;

  // Cycling specific
  @ApiPropertyOptional({ example: 800, description: 'Elevation gain in meters' })
  @ValidateIf((o: CreateSeanceDto) => o.sportType === SportType.CYCLING)
  @IsOptional()
  @IsInt()
  @Min(0)
  elevation?: number;

  // Renforcement specific
  @ApiPropertyOptional({ type: [ExerciseDto] })
  @ValidateIf((o: CreateSeanceDto) => o.sportType === SportType.RENFORCEMENT)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDto)
  exercises?: ExerciseDto[];
}
