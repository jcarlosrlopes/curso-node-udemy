import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';
import Order from '../typeorm/entities/Order';
import ProductsRepository from '@modules/products/typeorm/repositories/ProductsRepository';

interface ProductDTO {
  id: string;
  quantity: number;
  price: number;
}

interface RequestDTO {
  customer_id: string;
  products: ProductDTO[];
}

export default class CreateOrderService {
  public async execute({ customer_id, products }: RequestDTO): Promise<Order> {
    const repository = getCustomRepository(OrdersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductsRepository);

    const OrderExists = await repository.findByName(name);
    if (OrderExists) {
      throw new AppError('There is already a Order with this name');
    }

    const newOrder = repository.create({ name, price, quantity });
    await repository.save(newOrder);

    return newOrder;
  }
}
