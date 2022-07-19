import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from 'src/auth/auth.service';
import { sendEmail } from 'src/send-email/sendEmail';
import { HashPassword } from 'src/shared/password_hash/passwordHash';
import { UserRoles } from 'src/types/roles';
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

  @ApiBearerAuth()
  @Get('all')
  async getAllUsers(@Res() res: Response, @Req() req) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      if (!token) {
        throw new NotFoundException('Token does not exist!!!');
      }
      const tokenId = await this.authService.afterDecode(token);
      if (!tokenId) {
        throw new BadRequestException('Something went wrong!!!');
      }
      const user = await this.userService.getUserById(tokenId);
      if (user.role !== UserRoles.Admin) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const allUsers = await this.userService.getAllUsers();
      if (!allUsers) {
        throw new UnprocessableEntityException('Users is not exist!!!');
      }
      res.status(HttpStatus.OK).json(allUsers);
    } catch (error) {
      throw error;
    }
  }
  //logout
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get('logout')
  async logout(@Res() res: Response, @Req() req) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');
      if (!token) {
        throw new NotFoundException('Token does not exist !!!');
      }
      const decId = await this.authService.afterDecode(token);
      if (!decId) {
        throw new NotFoundException('Decode id does not exist !!!');
      }
      const user = await this.userService.getUserById(decId);
      if (user.token !== token) {
        throw new BadRequestException('Token is removed!!!');
      }
      if (!user.token || !user) {
        throw new BadRequestException('User is not defined!!!');
      }
      await this.userService.deleteToken(user.id);
      return res.status(HttpStatus.RESET_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
  // get by id
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Get(':id')
  async getTask(@Req() req, @Param('id') id: number, @Res() res: Response) {
    try {
      const token = (req.headers['authorization'] + '').split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const payload = await this.authService.decodeToken(token);
      const user = await this.authService.validateUser(payload, token);

      if (!(await this.authService.adminVerify(user))) {
        throw new UnauthorizedException('User is not unauthorized!!!');
      }
      const userGet = await this.userService.getUserById(id);
      if (!userGet) {
        throw new BadRequestException('user is not exist!!!');
      }
      return res.status(HttpStatus.OK).json(userGet);
    } catch (error) {
      throw error;
    }
  }

  // delete user
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('user is not authorized');
      }
      if (!(await this.authService.adminVerify(token))) {
        throw new UnauthorizedException('Admin not authorized !!!');
      }
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User is not found !');
      }
      await this.userService.deleteUser(id);
      return res.status(HttpStatus.NO_CONTENT).json({
        success: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
