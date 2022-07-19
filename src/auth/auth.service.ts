import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginValidationPipe } from 'src/pipes/user.email.valid';
import { UserRoles } from 'src/types/roles';
import UserEntityBase from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: any, token: string): Promise<any> {
    try {
      if (!token || token.length < 10 || !payload) {
        return null;
      }
      const userQuery: any = { token, role: payload.role };
      if (UserLoginValidationPipe.isEmail(payload.email)) {
        userQuery.email = payload.email.toLowerCase();
      }
      if (this.jwtService.decode(token.toString())) {
        let user: UserEntityBase;
        if (payload.role === UserRoles.Guest) {
          user = await this.usersService.getUserByEmail(userQuery.email);
        } else if (payload.role === UserRoles.User) {
          user = await this.usersService.getUserByEmail(userQuery.email);
        } else if (payload.role === UserRoles.Supervisor) {
          user = await this.usersService.getUserByEmail(userQuery.email);
        } else {
          user = await this.usersService.getUserByEmail(userQuery.email);
        }
        if (user && user.token === token) {
          return user;
        }
      }
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  // decode token
  async decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
  // after decode token
  async afterDecode(token: any) {
    try {
      const user = await this.decodeToken(token);
      const id = await this.decodeHashIdUser(user.sub);
      return id;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // create access token
  async login(user: UserEntityBase, ip: string) {
    try {
      const hashId = await this.hashIdUser(user.id);
      const payload = {
        email: user.email,
        sub: hashId,
        role: user.role,
        ip: ip,
      };
      return this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn,
      });
    } catch (error) {
      throw new UnprocessableEntityException('error: create jwt token', error);
    }
  }

  // hash id user
  async hashIdUser(id: number) {
    try {
      const status418 = 418;
      const statusName = "I'm_a_teapot";
      const binary = id.toString(2);
      const str = status418 + binary + status418 + statusName;
      return str;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // incode hash id user
  async decodeHashIdUser(str: string) {
    try {
      const re = /\s*418\s*/;
      const nameList = str.split(re);
      const str2: any = nameList[1];
      let dec = 0;
      for (let i = 0; i < str2.length; ++i) {
        dec = dec + str2[i] * 2 ** (str2.length - i);
      }
      dec /= 2;
      return dec;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  // admin role verify
  async adminVerify(user: UserEntityBase) {
    try {
      if (!user.role) {
        throw new UnprocessableEntityException('User role not exist!!!');
      }
      if (user.role === UserRoles.Admin) {
        return user.role;
      } else {
        throw new UnauthorizedException('Unauthorized user!!!');
      }
    } catch (error) {
      throw error;
    }
  }

  // superviser role verify
  async superviserVerify(user: UserEntityBase) {
    if (!user.role) {
      throw new UnprocessableEntityException('User role not exist!!!');
    }
    if (user.role === UserRoles.Admin) {
      return user.role;
    } else if (user.role === UserRoles.Supervisor) {
      return user.role;
    } else {
      throw new UnauthorizedException('Unauthorized user!!!');
    }
  }

  // user role verify
  async userVerify(user: UserEntityBase) {
    if (!user.role) {
      throw new UnprocessableEntityException('User role not exist!!!');
    }
    if (user.role === UserRoles.Admin) {
      return user.role;
    } else if (user.role === UserRoles.Supervisor) {
      return user.role;
    } else if (user.role === UserRoles.User) {
      return user.role;
    } else {
      throw new UnauthorizedException('Unauthorized user!!!');
    }
  }
}
