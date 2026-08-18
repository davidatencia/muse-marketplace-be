import { Request, Response, NextFunction } from 'express';

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'https://muse-accesories.netlify.app'];

export default function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  if (origin && ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
}
