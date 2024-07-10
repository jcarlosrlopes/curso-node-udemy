import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUsersService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import SendForgotPasswordEmailService from '../services/SendForgotPasswordEmailService';

export default class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUsers = new ListUsersService();

    console.log(request.user.id);

    const users = await listUsers.execute();
    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });
    return response.json(user);
  }

  public async updateAvatar(request: Request, response: Response) {
    const updateAvatar = new UpdateUserAvatarService();

    const user = updateAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file?.filename as string,
    });

    return response.json(user);
  }

  public async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;
    const forgotPasswordService = new SendForgotPasswordEmailService();

    await forgotPasswordService.execute({ email });
    response.status(204).json();
  }
}
