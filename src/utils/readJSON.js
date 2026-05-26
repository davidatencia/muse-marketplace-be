import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export function readJSON(filePath) {
  try {
    const data = require(filePath);
    return data;
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}:`, error);
    throw error;
  }
}

export default readJSON;
