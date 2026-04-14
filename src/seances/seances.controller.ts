import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/user.entity';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';
import { SportType } from './enums/sport-type.enum';
import { SeancesService } from './seances.service';

@ApiTags('seances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seances')
export class SeancesController {
  constructor(private readonly seancesService: SeancesService) {}

  @Post()
  create(@Request() req: { user: User }, @Body() dto: CreateSeanceDto) {
    return this.seancesService.create(req.user.id, dto);
  }

  @ApiQuery({ name: 'week', required: false, example: '2026-W15' })
  @ApiQuery({ name: 'sport', required: false, enum: SportType })
  @Get()
  findAll(
    @Request() req: { user: User },
    @Query('week') week?: string,
    @Query('sport') sport?: SportType,
  ) {
    return this.seancesService.findAll(req.user.id, { week, sport });
  }

  @Get(':id')
  findOne(@Request() req: { user: User }, @Param('id') id: string) {
    return this.seancesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateSeanceDto,
  ) {
    return this.seancesService.update(req.user.id, id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Request() req: { user: User }, @Param('id') id: string) {
    return this.seancesService.remove(req.user.id, id);
  }
}
