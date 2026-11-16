import { Expose } from 'class-transformer';
import type { User } from '../user.entity';

export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  constructor(entity: User) {
    this.id = entity.id;
    this.email = entity.email;
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
