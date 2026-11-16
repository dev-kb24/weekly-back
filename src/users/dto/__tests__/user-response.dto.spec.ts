import type { User } from '../../user.entity';
import { UserResponseDto } from '../user-response.dto';

const mockUser: User = {
  id: 'user-uuid',
  email: 'john@example.com',
  password: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe',
  refreshTokenHash: 'some_hash',
  seances: [],
  createdAt: new Date('2026-04-14T10:00:00.000Z'),
  updatedAt: new Date('2026-04-14T10:00:00.000Z'),
};

describe('UserResponseDto', () => {
  it('expose les champs publics de l\'utilisateur', () => {
    const dto = new UserResponseDto(mockUser);

    expect(dto.id).toBe('user-uuid');
    expect(dto.email).toBe('john@example.com');
    expect(dto.firstName).toBe('John');
    expect(dto.lastName).toBe('Doe');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(dto.updatedAt).toBeInstanceOf(Date);
  });

  it('n\'expose pas password, refreshTokenHash et seances', () => {
    const dto = new UserResponseDto(mockUser) as Record<string, unknown>;

    expect(dto).not.toHaveProperty('password');
    expect(dto).not.toHaveProperty('refreshTokenHash');
    expect(dto).not.toHaveProperty('seances');
  });
});
