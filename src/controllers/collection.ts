import { Request, Response } from 'express';
import { pool } from '../database';
import { verify } from 'jsonwebtoken';
import { MyToken } from '../types';

export const addToCollection = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;

    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error('Environment variable not set');
    }

    if (!req.token) {
      return res.status(403).json({ error: 'token missing' });
    }

    const decodedToken = <MyToken>verify(req.token, secret);

    if (!decodedToken.id) {
      return res.status(403).json({ error: 'invalid token' });
    }

    const bookInLibrary = Boolean(
      (
        await pool.query(
          'SELECT BOOK_ID, TITLE FROM "BOOKS" WHERE BOOK_ID = ($1)',
          [bookId]
        )
      ).rowCount
    );

    if (!bookInLibrary) {
      res.status(404).json({ error: 'Invalid book id' });
    }

    const isBookInCollection = Boolean(
      (
        await pool.query(
          'SELECT BOOK_ID FROM "USER_COLLECTIONS" WHERE BOOK_ID = $1 AND USER_ID = $2',
          [bookId, decodedToken.id]
        )
      ).rowCount
    );

    if (isBookInCollection) {
      res.status(400).json({ error: 'Book is already in the collection' });
    }

    const response = await pool.query(
      'INSERT INTO "USER_COLLECTIONS" (BOOK_ID, USER_ID) VALUES ($1, $2) RETURNING *',
      [bookId, decodedToken.id]
    );
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

export const removeFromCollection = async (req: Request, res: Response) => {
  try {
    const collectionId = req.params.id;

    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error('Environment variable not set');
    }

    if (!req.token) {
      return res.status(403).json({ error: 'token missing' });
    }

    const decodedToken = <MyToken>verify(req.token, secret);

    if (!decodedToken.id) {
      return res.status(403).json({ error: 'invalid token' });
    }

    const isBookInCollection = Boolean(
      (
        await pool.query(
          'SELECT BOOK_ID FROM "USER_COLLECTIONS" WHERE BOOK_ID = $1 AND USER_ID = $2',
          [collectionId, decodedToken.id]
        )
      ).rowCount
    );

    if (!isBookInCollection) {
      res.status(400).json({ error: 'Book is not in the collection' });
    }

    const response = await pool.query(
      'DELTE FROM "USER_COLLECTIONS" WHERE UC_ID = $1',
      [collectionId]
    );
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};
