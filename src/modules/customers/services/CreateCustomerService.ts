import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';
import { hash } from 'bcryptjs';

interface RequestDTO {
  name: string;
  email: string;
}

export default class CreateCustomerservice {
  public async execute({ name, email }: RequestDTO): Promise<Customer> {
    const repository = getCustomRepository(CustomersRepository);

    const emailExists = await repository.findByEmail(email);
    if (emailExists) {
      throw new AppError('There is already a customer with this email');
    }

    const newCustomer = repository.create({
      name,
      email,
    });
    await repository.save(newCustomer);

    return newCustomer;
  }
}
