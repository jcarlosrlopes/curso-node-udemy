import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';

export default class ListUsersService {
  public async execute(): Promise<User[]> {
    const repository = getCustomRepository(UsersRepository);
    return repository.find();
  }
}
