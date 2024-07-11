import { getCustomRepository } from 'typeorm';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import UserToken from '../typeorm/entities/UserToken';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';

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

    await EtherealMail.sendMail({
      to: email,
      body: `Solicitação de redefinição de senha recebida: ${token?.token}`,
    });
  }
}
