import { Request, Response } from 'express';
import { pool } from '../database';

export const ping = (_req: Request, res: Response) => {
  console.log('Someone pinged here');
  res.send('pong');
};

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT * FROM "BOOKS"');

    console.log(response.rows);
    return res.json(response.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal error');
  }
};
