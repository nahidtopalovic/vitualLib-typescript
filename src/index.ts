import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import indexRoutes from './routes';
// import { seedDatabase } from './database/seed';

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('combined'));
app.use(indexRoutes);

import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'postgres',
  database: 'express-ts',
  port: 5432,
});

client
  .connect()
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log('Did not connect:', err));

// Seed the database
// void seedDatabase();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
