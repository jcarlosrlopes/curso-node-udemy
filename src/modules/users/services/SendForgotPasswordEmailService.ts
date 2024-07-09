import { getCustomRepository } from 'typeorm';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import UserToken from '../typeorm/entities/UserToken';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
  email: string;
}

export default class SendForgotPasswordEmailService {
  public async execute({ email }: RequestDTO): Promise<void> {
    const userRepository = getCustomRepository(UsersRepository);
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const existingUser = await userRepository.findByEmail(email);
    if (!existingUser) {
      throw new AppError('User does not exists!');
    }

    const token = await userTokenRepository.generateToken(existingUser.id);

    console.log(token);
  }
}
