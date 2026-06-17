import { SECRET_JWT_KEY } from '@configFile';
import { UserInformation } from '@sharedTypes/user.interface.js';
import jwt from 'jsonwebtoken';

export class AuthService {
  static generateToken(payload: UserInformation): string {
    if (!SECRET_JWT_KEY) throw new Error('JWT secret is not defined');
    return jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: '2h' });
  }

  static generateRefreshToken(payload: UserInformation): string {
    if (!SECRET_JWT_KEY) throw new Error('JWT secret is not defined');
    return jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: '7d' });
  }

  static verifyToken(token: string): jwt.JwtPayload | string {
    if (!SECRET_JWT_KEY) throw new Error('JWT secret is not defined');
    return jwt.verify(token, SECRET_JWT_KEY);
  }
}
