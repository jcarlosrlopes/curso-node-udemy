import { getCustomRepository } from 'typeorm';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';

export default class DeleteProductService {
  public async execute(uuid: string): Promise<void> {
    const repository = getCustomRepository(ProductsRepository);
    const product = await repository.findOne(uuid);

    if (!product) throw new AppError('Product not found!');

    await repository.remove(product);
  }
}
