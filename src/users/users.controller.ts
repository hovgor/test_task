import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { sendEmail } from 'src/send-email/sendEmail';
import { HashPassword } from 'src/shared/password_hash/passwordHash';
import { UserValidator } from 'src/validaters/UserValidator';
import { UserLoginDto } from './dto/userLoginDto';
import { UserRegisterDto } from './dto/userRegisterDto';
import UserEntityBase from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordHash: HashPassword,
    private readonly userValidator: UserValidator,
    private readonly authService: AuthService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/register')
  async userRegister(@Body() body: UserRegisterDto, @Res() res: Response) {
    try {
      if (!this.userValidator.userEmail(body.email)) {
        throw new BadRequestException('Email is not valid!!!');
      }
      const verifayEmail = await this.userService.getUserByEmail(
        body.email.toLowerCase(),
      );
      if (verifayEmail) {
        throw new UnprocessableEntityException(
          'User with this email already exists!!!',
        );
      }
      if (body.repeatPassword !== body.password) {
        throw new BadRequestException('Passwords do not match!!!');
      }
      const hashPassword: string = await this.passwordHash.PasswordHash(
        body.password,
      );

      sendEmail(body.email.toLowerCase());

      await this.userService.userRegister({
        email: body.email.toLowerCase(),
        role: body.role,
        password: hashPassword,
      });
      return res.status(HttpStatus.CREATED).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // user login
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(
    @Body() body: UserLoginDto,
    @Res() res: Response,
    @RealIP() ip: string,
  ) {
    try {
      const user: UserEntityBase = await this.userService.getUserByEmail(
        body.email.toLowerCase(),
      );
      if (!user) {
        throw new BadRequestException(
          `User with this email(${body.email}) does not exist !`,
        );
      }
      const isMatch = await this.passwordHash.IsMutchPassword(
        body.password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }
      const token = await this.authService.login(user, ip);

      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      await this.userService.insertToken(token, user.id);
      return res.status(HttpStatus.OK).json({
        access_token: token,
      });
    } catch (error) {
      throw error;
    }
  }
}
