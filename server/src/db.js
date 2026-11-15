import pg from "pg";
import "dotenv/config";

// A "pool" keeps a few connections to the database open, ready to use
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // the address from your .env file
});

export default pool;