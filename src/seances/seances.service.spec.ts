import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seance } from './seance.entity';
import { SeancesService } from './seances.service';
import { SportType } from './enums/sport-type.enum';

const userId = 'user-uuid';

const mockSeance: Seance = {
  id: 'seance-uuid',
  userId,
  date: '2026-04-14',
  sportType: SportType.RUNNING,
  seanceType: 'EF',
  duration: 60,
  distance: 10,
  notes: null,
  allure: 6.0,
  heartRate: 140,
  elevation: null,
  exercises: [],
  user: null as never,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  remove: jest.fn(),
});

describe('SeancesService', () => {
  let service: SeancesService;
  let seanceRepo: jest.Mocked<Repository<Seance>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeancesService,
        { provide: getRepositoryToken(Seance), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(SeancesService);
    seanceRepo = module.get(getRepositoryToken(Seance));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('crée et sauvegarde une séance pour l\'utilisateur', async () => {
      seanceRepo.create.mockReturnValue(mockSeance);
      seanceRepo.save.mockResolvedValue(mockSeance);

      const dto = {
        date: '2026-04-14',
        sportType: SportType.RUNNING,
        duration: 60,
        distance: 10,
        allure: 6.0,
      };

      const result = await service.create(userId, dto as never);

      expect(seanceRepo.create).toHaveBeenCalledWith({ ...dto, userId });
      expect(seanceRepo.save).toHaveBeenCalledWith(mockSeance);
      expect(result).toEqual(mockSeance);
    });
  });

  describe('findAll', () => {
    it('retourne les séances de l\'utilisateur sans filtre', async () => {
      seanceRepo.find.mockResolvedValue([mockSeance]);

      const result = await service.findAll(userId, {});

      expect(seanceRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId } }),
      );
      expect(result).toHaveLength(1);
    });

    it('filtre par sport', async () => {
      seanceRepo.find.mockResolvedValue([mockSeance]);

      await service.findAll(userId, { sport: SportType.RUNNING });

      expect(seanceRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ sportType: SportType.RUNNING }),
        }),
      );
    });

    it('filtre par semaine ISO et calcule la plage de dates', async () => {
      seanceRepo.find.mockResolvedValue([mockSeance]);

      await service.findAll(userId, { week: '2026-W15' });

      const call = seanceRepo.find.mock.calls[0][0] as { where: { date: unknown } };
      expect(call.where).toHaveProperty('date');
    });
  });

  describe('findOne', () => {
    it('retourne la séance si elle appartient à l\'utilisateur', async () => {
      seanceRepo.findOne.mockResolvedValue(mockSeance);

      const result = await service.findOne(userId, 'seance-uuid');

      expect(result).toEqual(mockSeance);
    });

    it('lève NotFoundException si la séance n\'existe pas', async () => {
      seanceRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId, 'unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('lève ForbiddenException si la séance appartient à un autre utilisateur', async () => {
      seanceRepo.findOne.mockResolvedValue({
        ...mockSeance,
        userId: 'other-user',
      });

      await expect(service.findOne(userId, 'seance-uuid')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('met à jour et sauvegarde la séance', async () => {
      const updated = { ...mockSeance, duration: 90 };
      seanceRepo.findOne.mockResolvedValue(mockSeance);
      seanceRepo.merge.mockReturnValue(updated);
      seanceRepo.save.mockResolvedValue(updated);

      const result = await service.update(userId, 'seance-uuid', {
        duration: 90,
      });

      expect(seanceRepo.merge).toHaveBeenCalledWith(mockSeance, { duration: 90 });
      expect(result.duration).toBe(90);
    });
  });

  describe('remove', () => {
    it('supprime la séance', async () => {
      seanceRepo.findOne.mockResolvedValue(mockSeance);
      seanceRepo.remove.mockResolvedValue(mockSeance);

      await service.remove(userId, 'seance-uuid');

      expect(seanceRepo.remove).toHaveBeenCalledWith(mockSeance);
    });
  });
});
