import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';

export default class ShowProductService {
  public async execute(uuid: string): Promise<Product> {
    const repository = getCustomRepository(ProductsRepository);
    const product = await repository.findOne(uuid);

    if (!product) throw new AppError('Product not found!');

    return product;
  }
}
