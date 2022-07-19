import { IsDate, IsEmail, IsInt, IsString, Length } from 'class-validator';
import { UserRoles } from 'src/types/roles';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class UserEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @IsInt()
  id: number;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Length(8, 16)
  password: string;

  @Column({ type: 'smallint', default: UserRoles.Guest })
  @IsInt()
  role: UserRoles;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @IsString()
  public token: string;

  @CreateDateColumn({ name: 'created_at' })
  @IsDate()
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
  @IsDate()
  public updatedAt: Date;
}
