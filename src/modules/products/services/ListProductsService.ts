import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

export default class ListProductsService {
  public async execute(): Promise<Product[]> {
    const repository = getCustomRepository(ProductsRepository);
    return repository.find();
  }
}
