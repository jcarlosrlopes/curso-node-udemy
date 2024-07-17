import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface RequestDTO {
  id: string;
  name: string;
  email: string;
}

export default class UpdateCustomerService {
  public async execute({ id, name, email }: RequestDTO): Promise<Customer> {
    const repository = getCustomRepository(CustomersRepository);

    const customer = await repository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found!');
    }

    const customerExists = await repository.findByEmail(email);
    if (customerExists && email !== customer.email) {
      throw new AppError("There's already a customer with this email.");
    }

    customer.name = name;
    customer.email = email;

    repository.save(customer);

    return customer;
  }
}
