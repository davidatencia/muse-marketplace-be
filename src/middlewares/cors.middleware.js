const ACCEPTED_ORIGINS = ['http://localhost:3000'];

export default function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;

  if (ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
