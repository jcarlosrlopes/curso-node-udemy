import { getCustomRepository } from 'typeorm';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import UserToken from '../typeorm/entities/UserToken';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface RequestDTO {
  token: string;
  password: string;
}

export default class ResetPasswordService {
  public async execute({ token, password }: RequestDTO): Promise<void> {
    const userRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError("User token doesn't exists!");
    }

    const existingUser = await userRepository.findById(userToken.user_id);
    if (!existingUser) {
      throw new AppError('User does not exists!');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired!');
    }

    existingUser.password = await hash(password, 8);
    userRepository.save(existingUser);
  }
}
