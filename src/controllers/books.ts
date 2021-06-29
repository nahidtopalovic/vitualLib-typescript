import { Request, Response } from 'express';
import { pool } from '../database';

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const response = await pool.query(
      'SELECT BOOK_ID, TITLE, AUTHOR, YEAR, EDITION FROM "BOOKS"'
    );

    return res.json(response.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal error');
  }
};
