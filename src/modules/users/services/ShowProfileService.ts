import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
  userId: string;
}

export default class ShowProfileService {
  public async execute({ userId }: RequestDTO): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found!');
    }

    return user;
  }
}
