import { BadRequestException } from '@nestjs/common';

export class UserValidator {
  public userEmail(email: string) {
    try {
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(validRegex)) {
        return email;
      } else {
        throw new BadRequestException('Invalid email address!!!');
      }
    } catch (error) {
      throw error;
    }
  }
}
