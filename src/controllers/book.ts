import { Request, Response } from 'express';
import { pool } from '../database';
import { verify } from 'jsonwebtoken';
import { Book, MyToken } from '../types';
import { toNewBook } from '../utils';

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const response = await pool.query(
      'SELECT BOOK_ID, TITLE, AUTHOR, YEAR, EDITION FROM "BOOKS"'
    );

    res.status(200).json(response.rows);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal error');
    return;
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const newBook: Book = toNewBook(req.body);

    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error('Environment variable not set');
    }

    if (!req.token) {
      res.status(403).json({ error: 'token missing' });
      return;
    }

    const decodedToken = <MyToken>verify(req.token, secret);

    if (!decodedToken.id) {
      res.status(403).json({ error: 'invalid token' });
      return;
    }

    const usersInDb = await pool.query(
      'SELECT USER_ID, EMAIL, IS_ADMIN FROM "USERS" WHERE USER_ID = $1',
      [decodedToken.id]
    );

    const isAdmin = Boolean(usersInDb.rows[0].is_admin);

    if (!isAdmin) {
      res.status(401).json({ error: 'Invalid permissions' });
      return;
    }

    const response = await pool.query(
      'INSERT INTO "BOOKS"(TITLE, AUTHOR, YEAR, EDITION) VALUES($1, $2, $3, $4) RETURNING *',
      [newBook.title, newBook.author, newBook.year_written, newBook.edition]
    );
    res.status(201).json(response.rows[0]);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
};

export const removeBook = async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);

    const secret = process.env.SECRET;

    if (!secret) {
      throw new Error('Environment variable not set');
    }

    if (!req.token) {
      res.status(403).json({ error: 'token missing' });
      return;
    }

    const decodedToken = <MyToken>verify(req.token, secret);

    if (!decodedToken.id) {
      res.status(403).json({ error: 'invalid token' });
      return;
    }

    const usersInDb = await pool.query(
      'SELECT USER_ID, EMAIL, IS_ADMIN FROM "USERS" WHERE USER_ID = $1',
      [decodedToken.id]
    );

    const isAdmin = Boolean(usersInDb.rows[0].is_admin);

    if (!isAdmin) {
      res.status(401).json({ error: 'Invalid permissions' });
      return;
    }

    const bookInLibrary = Boolean(
      (
        await pool.query('SELECT BOOK_ID FROM "BOOKS" WHERE BOOK_ID = ($1)', [
          bookId,
        ])
      ).rowCount
    );

    if (!bookInLibrary) {
      res.status(404).json({ error: 'Invalid book id' });
      return;
    }

    await pool.query('DELETE FROM "BOOKS" WHERE BOOK_ID = $1', [bookId]);
    res.status(200).json('Book removed!');
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
};
