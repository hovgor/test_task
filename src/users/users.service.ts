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

  // get user by id
  async getUserById(id: number) {
    try {
      return await this.usersRepository.findOne({ where: { id: id } });
    } catch (error) {
      Logger.log('error: get user by id =>', error);
      throw error;
    }
  }

  // get all users
  async getAllUsers() {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      Logger.log('error: get all users => ', error);
      throw error;
    }
  }

  // update user
  async updateUser(id: number, data: any) {
    try {
      return await this.usersRepository.update({ id }, data);
    } catch (error) {
      Logger.log('error: update user =>', error);
      throw error;
    }
  }

  // get user by email
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

  // delete user
  async deleteUser(id: number) {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      Logger.log('error: delete user by id => ', error);
      throw error;
    }
  }

  // delete token in db
  async deleteToken(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      user.token = null;
      return await this.usersRepository.save(user);
    } catch (error) {
      Logger.log('error: delete token => ', error);
      throw error;
    }
  }
}
