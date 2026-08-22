const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:%22WxR%5D%22G%3EQ5yxg%5DC@db.gdowppsldfjloqvcyzpi.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW(), version();');
    console.log('CONNECTED TO SUPABASE POSTGRESQL SUCCESSFULLY!');
    console.log(res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

test();
