import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Load env manually since we are in a script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const match = envConfig.match(/DATABASE_URL="?([^"\n]+)"?/);
  if (match) connectionString = match[1];
}

console.log('Testing connection with:', connectionString ? 'Found URL' : 'No URL');

async function testConfig(name, config) {
    console.log(`Testing config: ${name}`);
    const pool = new Pool(config);
    try {
        const client = await pool.connect();
        console.log(`SUCCESS: ${name}`);
        client.release();
        await pool.end();
        return true;
    } catch (e) {
        console.log(`FAILED: ${name} - ${e.message}`);
        await pool.end();
        return false;
    }
}

async function runTests() {
    if (!connectionString) {
        console.error("No connection string found");
        return;
    }

    // Test 1: Only connectionString
    await testConfig('Only String', { connectionString });

    // Test 2: String + ssl: true
    await testConfig('String + ssl: true', { connectionString, ssl: true });

    // Test 3: String + ssl: { rejectUnauthorized: false }
    await testConfig('String + ssl: rejectUnauthorized: false', { connectionString, ssl: { rejectUnauthorized: false } });
    
    // Test 4: String + ssl: { rejectUnauthorized: true }
    await testConfig('String + ssl: rejectUnauthorized: true', { connectionString, ssl: { rejectUnauthorized: true } });
}

runTests();
