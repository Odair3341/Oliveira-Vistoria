import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://neondb_owner:npg_CgPptmNM8vk7@ep-polished-boat-acznx6r0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Often needed for some hosted PGs if CA not provided
    },
  });

  try {
    await client.connect();
    console.log('Connected to database successfully.');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema migration...');
    await client.query(sql);
    console.log('Schema applied successfully!');

  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await client.end();
  }
}

migrate();
