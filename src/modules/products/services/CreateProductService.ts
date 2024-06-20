import { getCustomRepository } from 'typeorm';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';

interface RequestDTO {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService {
  public async execute({
    name,
    price,
    quantity,
  }: RequestDTO): Promise<Product> {
    const repository = getCustomRepository(ProductsRepository);

    const productExists = await repository.findByName(name);
    if (productExists) {
      throw new AppError('There is already a product with this name');
    }

    const newProduct = repository.create({ name, price, quantity });
    await repository.save(newProduct);

    return newProduct;
  }
}
