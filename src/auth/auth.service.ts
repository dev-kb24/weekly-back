import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const password = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const user = this.userRepo.create({ ...dto, password });
    return this.userRepo.save(user);
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    return this.generateAndSaveTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash)
      throw new UnauthorizedException('Invalid refresh token');

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!tokenMatch) throw new UnauthorizedException('Invalid refresh token');

    return this.generateAndSaveTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.userRepo.update(userId, { refreshTokenHash: null });
  }

  private async generateAndSaveTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);
    await this.userRepo.update(user.id, { refreshTokenHash });

    return { accessToken, refreshToken };
  }
}
