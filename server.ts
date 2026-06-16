import 'dotenv/config';
import { DEFAULT_PORT } from "@configFile";
import app from './src/app.js';

const PORT = process.env.PORT ?? DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
