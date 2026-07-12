import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,

    max: 25,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000  
});

export default pool;