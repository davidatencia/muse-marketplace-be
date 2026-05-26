export default function notFoundMiddleware(req, res) {
  res.status(404).json({ message: 'Not Found' });
}
