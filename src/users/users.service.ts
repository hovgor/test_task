import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterForDbDto } from './dto/userRegisterForDbDto';
import UserEntity from './users.pg.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    public usersRepository: Repository<UserEntity>,
  ) {}

  // create user
  async userRegister(data: UserRegisterForDbDto) {
    try {
      return await this.usersRepository.save(this.usersRepository.create(data));
    } catch (error) {
      Logger.log('error: User register service => ', error);
      throw error;
    }
  }

  async getUserByEmail(data: string) {
    try {
      return await this.usersRepository.findOne({ where: { email: data } });
    } catch (error) {
      Logger.log('error: User get by email service => ', error);
      throw error;
    }
  }

  // insert token in db
  async insertToken(token: string, id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id } });
      user.token = token;
      return await this.usersRepository.save(user);
    } catch (error) {
      Logger.log('error: insert token in db => ', error);
      throw error;
    }
  }
}
