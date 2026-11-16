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
import { ApiResponse } from '../common/presenters/api-response.presenter';
import { User } from '../users/user.entity';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { SeanceResponseDto } from './dto/seance-response.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';
import { SeancesService } from './seances.service';

@ApiTags('seances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seances')
export class SeancesController {
  constructor(private readonly seancesService: SeancesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: { user: User },
    @Body() dto: CreateSeanceDto,
  ): Promise<ApiResponse<SeanceResponseDto>> {
    const seance = await this.seancesService.create(req.user.id, dto);
    return new ApiResponse(201, 'success', new SeanceResponseDto(seance));
  }

  @ApiQuery({ name: 'week', required: false, example: '2026-W15' })
  @Get()
  async findAll(
    @Request() req: { user: User },
    @Query('week') week?: string,
  ): Promise<ApiResponse<SeanceResponseDto[]>> {
    const seances = await this.seancesService.findAll(req.user.id, { week });
    return new ApiResponse(
      200,
      'success',
      seances.map((s) => new SeanceResponseDto(s)),
    );
  }

  @Get(':id')
  async findOne(
    @Request() req: { user: User },
    @Param('id') id: string,
  ): Promise<ApiResponse<SeanceResponseDto>> {
    const seance = await this.seancesService.findOne(req.user.id, id);
    return new ApiResponse(200, 'success', new SeanceResponseDto(seance));
  }

  @Patch(':id')
  async update(
    @Request() req: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateSeanceDto,
  ): Promise<ApiResponse<SeanceResponseDto>> {
    const seance = await this.seancesService.update(req.user.id, id, dto);
    return new ApiResponse(200, 'success', new SeanceResponseDto(seance));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Request() req: { user: User }, @Param('id') id: string) {
    return this.seancesService.remove(req.user.id, id);
  }
}
