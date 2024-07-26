import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';

interface RequestDTO {
  userId: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

export default class UpdateProfileService {
  public async execute({
    userId,
    email,
    name,
    oldPassword,
    password,
  }: RequestDTO): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found!');
    }

    const existingUserWithEmail = await repository.findByEmail(email);
    if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
      throw new AppError('There is already one user with this email.');
    }

    if (password && !oldPassword) {
      throw new AppError('Old password is required!');
    }

    if (password && oldPassword) {
      const oldPasswordMatches = await compare(oldPassword, user.password);

      if (!oldPasswordMatches) {
        throw new AppError("Old password doesn't match.");
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await repository.save(user);

    return user;
  }
}
