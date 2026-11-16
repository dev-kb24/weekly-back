import { CadenceType, DurationUnit, PartType } from '../../enums/sport-type.enum';
import type { RunningPartie } from '../../running-partie.entity';
import type { Seance } from '../../seance.entity';
import { RunningPartieResponseDto, SeanceResponseDto } from '../seance-response.dto';

const mockPartie: RunningPartie = {
  id: 'partie-uuid',
  seanceId: 'seance-uuid',
  order: 1,
  type: PartType.ECHAUFFEMENT,
  durationUnit: DurationUnit.TIME,
  durationMinutes: 15,
  distanceMeters: null,
  cadenceType: CadenceType.ZONE,
  heartRateZone: 2,
  allureMinMin: null,
  allureMinMax: null,
  repetitions: 1,
  blockId: null,
  seance: null as never,
  createdAt: new Date('2026-04-14T10:00:00.000Z'),
  updatedAt: new Date('2026-04-14T10:00:00.000Z'),
};

const mockSeance: Seance = {
  id: 'seance-uuid',
  userId: 'user-uuid',
  date: '2026-04-14',
  title: 'Fractionné du jeudi',
  notes: 'Belle sortie',
  parties: [mockPartie],
  user: null as never,
  createdAt: new Date('2026-04-14T10:00:00.000Z'),
  updatedAt: new Date('2026-04-14T10:00:00.000Z'),
};

describe('RunningPartieResponseDto', () => {
  it('expose les champs métier de la partie', () => {
    const dto = new RunningPartieResponseDto(mockPartie);

    expect(dto.id).toBe('partie-uuid');
    expect(dto.order).toBe(1);
    expect(dto.type).toBe(PartType.ECHAUFFEMENT);
    expect(dto.durationUnit).toBe(DurationUnit.TIME);
    expect(dto.durationMinutes).toBe(15);
    expect(dto.distanceKm).toBeNull();
    expect(dto.cadenceType).toBe(CadenceType.ZONE);
    expect(dto.heartRateZone).toBe(2);
    expect(dto.allureMinMin).toBeNull();
    expect(dto.allureMinMax).toBeNull();
    expect(dto.repetitions).toBe(1);
    expect(dto.blockId).toBeNull();
  });

  it('convertit distanceMeters (m) en distanceKm (km) dans la réponse', () => {
    const dto = new RunningPartieResponseDto({ ...mockPartie, distanceMeters: 5000 });
    expect(dto.distanceKm).toBe(5);
  });

  it('convertit allureMinMin de secondes en minutes décimales dans la réponse', () => {
    // 270 sec = 4.5 min/km (4:30/km)
    const dto = new RunningPartieResponseDto({ ...mockPartie, allureMinMin: 270 });
    expect(dto.allureMinMin).toBe(270);
  });

  it('convertit allureMinMax de secondes en minutes décimales dans la réponse', () => {
    // 330 sec = 5.5 min/km (5:30/km)
    const dto = new RunningPartieResponseDto({ ...mockPartie, allureMinMax: 330 });
    expect(dto.allureMinMax).toBe(330);
  });

  it("n'expose pas seanceId, seance, createdAt, updatedAt", () => {
    const dto = new RunningPartieResponseDto(mockPartie) as Record<string, unknown>;

    expect(dto).not.toHaveProperty('seanceId');
    expect(dto).not.toHaveProperty('seance');
    expect(dto).not.toHaveProperty('createdAt');
    expect(dto).not.toHaveProperty('updatedAt');
  });
});

describe('SeanceResponseDto', () => {
  it('expose les champs métier de la séance', () => {
    const dto = new SeanceResponseDto(mockSeance);

    expect(dto.id).toBe('seance-uuid');
    expect(dto.date).toBe('2026-04-14');
    expect(dto.title).toBe('Fractionné du jeudi');
    expect(dto.notes).toBe('Belle sortie');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
  });

  it('transforme les parties en RunningPartieResponseDto', () => {
    const dto = new SeanceResponseDto(mockSeance);

    expect(dto.parties).toHaveLength(1);
    expect(dto.parties[0]).toBeInstanceOf(RunningPartieResponseDto);
    expect(dto.parties[0].id).toBe('partie-uuid');
  });

  it("n'expose pas userId et user", () => {
    const dto = new SeanceResponseDto(mockSeance) as Record<string, unknown>;

    expect(dto).not.toHaveProperty('userId');
    expect(dto).not.toHaveProperty('user');
  });
});
