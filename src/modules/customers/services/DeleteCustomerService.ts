import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

class DeleteCustomerService {
  public async execute(customerId: string): Promise<void> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(customerId);

    if (!customer) {
      throw new AppError('Customer not found!');
    }

    let a = await customersRepository.remove(customer);
    console.log(a);
  }
}

export default DeleteCustomerService;
