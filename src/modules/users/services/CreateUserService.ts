import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../typeorm/entities/User';
import { hash } from 'bcryptjs';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const repository = getCustomRepository(UsersRepository);

    const emailExists = await repository.findByEmail(email);
    if (emailExists) {
      throw new AppError('There is already a user with this email');
    }

    const hashedPassword = await hash(password, 8);

    const newUser = repository.create({
      name,
      email,
      password: hashedPassword,
    });
    await repository.save(newUser);

    return newUser;
  }
}
