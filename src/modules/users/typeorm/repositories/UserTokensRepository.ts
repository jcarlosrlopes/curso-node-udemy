import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
class UserTokensRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generateToken(userId: string): Promise<UserToken> {
    const userToken = await this.create({
      user_id: userId,
    });

    await this.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
