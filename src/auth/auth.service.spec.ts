import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

const mockUser: User = {
  id: 'user-uuid',
  email: 'john@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  refreshTokenHash: null,
  seances: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('signed_token'),
  verify: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      JWT_SECRET: 'test_secret',
      JWT_EXPIRES_IN: '1h',
      JWT_REFRESH_SECRET: 'test_refresh_secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
    };
    return map[key];
  }),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('crée un utilisateur avec le mot de passe haché', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(mockUser);
      userRepo.save.mockResolvedValue(mockUser);

      const dto = {
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      await service.register(dto);

      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: expect.not.stringContaining('password123'),
        }),
      );
      expect(userRepo.save).toHaveBeenCalledTimes(1);
    });

    it('lève ConflictException si l\'email existe déjà', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'john@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('lève UnauthorizedException si l\'utilisateur n\'existe pas', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lève UnauthorizedException si le mot de passe est incorrect', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'john@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('retourne accessToken et refreshToken si les identifiants sont valides', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      jest.mocked(bcrypt.hash).mockResolvedValue('hashed_refresh' as never);
      userRepo.update.mockResolvedValue(undefined as never);

      const result = await service.login({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('lève UnauthorizedException si le token est invalide', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refresh('bad_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('lève UnauthorizedException si le hash ne correspond pas', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-uuid' });
      userRepo.findOne.mockResolvedValue({
        ...mockUser,
        refreshTokenHash: 'stored_hash',
      });
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(service.refresh('refresh_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('retourne de nouveaux tokens si le refresh token est valide', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-uuid' });
      userRepo.findOne.mockResolvedValue({
        ...mockUser,
        refreshTokenHash: 'stored_hash',
      });
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);
      jest.mocked(bcrypt.hash).mockResolvedValue('new_hash' as never);
      userRepo.update.mockResolvedValue(undefined as never);

      const result = await service.refresh('valid_refresh');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('efface le refreshTokenHash de l\'utilisateur', async () => {
      userRepo.update.mockResolvedValue(undefined as never);

      await service.logout('user-uuid');

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid', {
        refreshTokenHash: null,
      });
    });
  });
});
