import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/User';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface RequestDTO {
  email: string;
  password: string;
}

interface UserResponseDTO {
  user: User;
  token: string;
}

export default class CreateSessionsService {
  public async execute({
    email,
    password,
  }: RequestDTO): Promise<UserResponseDTO> {
    const repository = getCustomRepository(UsersRepository);

    const user = await repository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiration,
    });

    return {
      user,
      token,
    };
  }
}
