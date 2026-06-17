import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '@configFile';
import { UserInformation } from '@sharedTypes/user.interface.js';
import { AuthService } from '@services/auth.service.js';

declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload | string;
    }
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Valid authorization token is required' });
    return;
  }

  const token = authorization.slice(7);

  try {
    const user = AuthService.verifyToken(token);
    req.user = user;
    if (!(user as UserInformation).is_active) {
      res.status(403).json({ message: 'Account is inactive' });
      return;
    }
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token has expired' });
      return;
    }
    res.status(403).json({ message: 'Invalid token' });
  }
}
