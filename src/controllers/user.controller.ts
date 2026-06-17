import { UserModel } from '@models/user.model.js';
import {
  validateUserLogin,
  validateUserRegister,
} from '@schemas/user.schema.js';
import { AuthService } from '@services/auth.service.js';
import { Request, Response } from 'express';

export default class UserController {
  static async login({ body }: Request, res: Response): Promise<void> {
    try {
      const { error } = validateUserLogin(body);

      if (error) {
        res.status(400).json({
          message: 'Invalid user data',
          details: error.issues[0].message,
        });
        return;
      }

      const user = await UserModel.login(body);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const access_token = AuthService.generateToken({
        ...user
      });
      res.status(200).json({ access_token, ...user });
    } catch (error) {
      res.status(500).json({
        message: 'Login failed',
        error: (error as NodeJS.ErrnoException).message,
      });
    }
  }

  static async register({ body }: Request, res: Response): Promise<void> {
    try {
      const { error } = validateUserRegister(body);

      if (error) {
        res.status(400).json({
          message: 'Invalid user data',
          details: error.issues[0].message,
        });
        return;
      }

      await UserModel.register(body);
      res.status(201).json({ message: 'Register successful' });
    } catch (error) {
      res.status(500).json({
        message: 'Register failed',
      });
    }
  }
}
