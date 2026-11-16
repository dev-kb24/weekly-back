import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/presenters/api-response.presenter';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(
    @Request() req: { user: User },
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.usersService.findById(req.user.id);
    return new ApiResponse(200, 'success', new UserResponseDto(user!));
  }
}
