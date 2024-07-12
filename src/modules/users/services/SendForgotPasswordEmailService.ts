import { getCustomRepository } from 'typeorm';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import UserToken from '../typeorm/entities/UserToken';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';
import path from 'path';

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

    const { token } = await userTokenRepository.generateToken(existingUser.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: {
        name: existingUser.name,
        email: existingUser.email,
      },
      subject: '[API Vendas] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: existingUser.name,
          link: `http://localhost:3000/users/reset_password?token=${token}`,
        },
      },
    });
  }
}
