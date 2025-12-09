import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

console.log('--- START TEST ---');
console.log('Checking env var...');
if (!process.env.DATABASE_URL) {
    console.error('MISSING DATABASE_URL');
    process.exit(1);
}
console.log('Length of URL:', process.env.DATABASE_URL.length);

const connectionString = process.env.DATABASE_URL;
// Replicating logic from api/db.js
const sslConfig = connectionString.includes('localhost') ? false : { rejectUnauthorized: false };

console.log('SSL Config:', sslConfig);

const pool = new Pool({
    connectionString,
    ssl: sslConfig,
});

async function run() {
    try {
        console.log('Connecting...');
        const res = await pool.query('SELECT 1 as val');
        console.log('SUCCESS:', res.rows[0]);
    } catch (err) {
        console.error('FAILURE CODE:', err.code);
        console.error('FAILURE MSG:', err.message);
        // console.error('FULL:', err);
    } finally {
        await pool.end();
    }
}

run();
