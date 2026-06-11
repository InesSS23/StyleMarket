require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: 'postgres',
});

(async () => {
  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'stylemarket';
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rows.length > 0) {
      console.log(`Database ${dbName} already exists.`);
    } else {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created.`);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
