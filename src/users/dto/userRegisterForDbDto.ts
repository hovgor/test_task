import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { UserRoles } from 'src/types/roles';

export class UserRegisterForDbDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty({ enum: UserRoles })
  role?: UserRoles;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}
