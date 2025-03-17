import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

pool.on('connect', () => {
    console.log('PostgreSQL connected successfully');
  });
  
  pool.on('error', (err) => {
    console.error(' PostgreSQL error', err);
    process.exit(-1);
  });
  
  export default pool;
