import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/User';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';

interface RequestDTO {
  userId: string;
  avatarFilename: string;
}

export default class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: RequestDTO): Promise<User> {
    const repository = getCustomRepository(UsersRepository);

    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found!');
    }

    if (user.avatar) {
      const userAvataFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvataFileExists = await fs.promises.stat(userAvataFilePath);

      if (userAvataFileExists) {
        await fs.promises.unlink(userAvataFilePath);
      }
    }

    user.avatar = avatarFilename;
    repository.save(user);

    return user;
  }
}
