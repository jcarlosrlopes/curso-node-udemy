import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/http/middlewares/authenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const usersController = new UsersController();

const upload = multer(uploadConfig);

usersRouter.get('/', isAuthenticated, usersController.index);
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersController.updateAvatar,
);

usersRouter.post(
  '/forgotPassword',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  usersController.forgotPassword,
);

export default usersRouter;
