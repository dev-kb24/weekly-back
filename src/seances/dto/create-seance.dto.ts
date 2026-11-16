import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CadenceType, DurationUnit, PartType } from '../enums/sport-type.enum';

export class CreateRunningPartieDto {
  @ApiPropertyOptional({ example: 'uuid', description: 'ID de la partie (pour mise à jour)' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({ enum: PartType })
  @IsEnum(PartType)
  type!: PartType;

  @ApiProperty({ enum: DurationUnit })
  @IsEnum(DurationUnit)
  durationUnit!: DurationUnit;

  @ApiPropertyOptional({ example: 15, description: 'Durée en minutes (si durationUnit = time)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Distance en km (si durationUnit = distance) — stockée en mètres en BDD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @ApiProperty({ enum: CadenceType })
  @IsEnum(CadenceType)
  cadenceType!: CadenceType;

  @ApiPropertyOptional({ example: 2, description: 'Zone cardiaque 1-5 (si cadenceType = zone)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  heartRateZone?: number;

  @ApiPropertyOptional({ example: 270, description: 'Allure minimum en sec/km (ex: 270 = 4min30s) — si cadenceType = allure' })
  @IsOptional()
  @IsInt()
  @Min(0)
  allureMinMin?: number;

  @ApiPropertyOptional({ example: 300, description: 'Allure maximum en sec/km (ex: 300 = 5min00s) — si cadenceType = allure' })
  @IsOptional()
  @IsInt()
  @Min(0)
  allureMinMax?: number;

  @ApiPropertyOptional({ example: 10, description: 'Nombre de répétitions du bloc' })
  @IsOptional()
  @IsInt()
  @Min(1)
  repetitions?: number;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID du bloc de répétition (parties groupées)' })
  @IsOptional()
  @IsString()
  @IsUUID()
  blockId?: string;
}

export class CreateSeanceDto {
  @ApiProperty({ example: '2026-04-14' })
  @IsISO8601({ strict: true })
  date!: string;

  @ApiPropertyOptional({ example: 'Fractionné du jeudi' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Bonne séance' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateRunningPartieDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRunningPartieDto)
  parties!: CreateRunningPartieDto[];
}
