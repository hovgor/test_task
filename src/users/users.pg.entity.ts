import { UserRoles } from 'src/types/roles';
import { Entity } from 'typeorm';
import UserEntityBase from './users.entity';

export interface IUserEntity {
  id: number;

  token: string;

  password: string;

  email: string;

  role: UserRoles;

  updatedAt: Date;

  createdAt: Date;
}

@Entity({ schema: 'default', name: 'Users' })
export default class UserEntity extends UserEntityBase implements IUserEntity {
  id: number;

  token: string;

  password: string;

  email: string;

  role: UserRoles;
}
