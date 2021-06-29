import { Pool, Client } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'postgres',
  database: 'express-ts',
  port: 5432,
});

export const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'postgres',
  database: 'express-ts',
  port: 5432,
});
