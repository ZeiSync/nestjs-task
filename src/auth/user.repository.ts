import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = this.create();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username_already_exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (!user) {
      return null;
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }
}
