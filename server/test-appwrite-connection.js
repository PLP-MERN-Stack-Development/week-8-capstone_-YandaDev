// Test Appwrite connectivity from Node.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
import { Client, Storage } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function testAppwrite() {
  try {
    // List files in the bucket as a simple test
    const files = await storage.listFiles(process.env.APPWRITE_BUCKET_ID);
    console.log('Appwrite connection successful. Files:', files);
  } catch (error) {
    console.error('Appwrite connection failed:', error);
  }
}

testAppwrite();
