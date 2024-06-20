import { getCustomRepository } from 'typeorm';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';

interface RequestDTO {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  public async execute({ id, name, price, quantity }: RequestDTO) {
    const repository = getCustomRepository(ProductsRepository);
    const product = await repository.findOne(id);

    if (!product) throw new AppError('Product not found!');

    const productExists = await repository.findByName(name);
    if (productExists && name != product.name) {
      throw new AppError('There is already a product with this name');
    }

    product.name = name as string;
    product.price = price;
    product.quantity = quantity;

    await repository.save(product);

    return product;
  }
}
