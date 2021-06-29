import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../database';
import { toNewUserEntry } from '../utils';

export const signUp = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newUser = toNewUserEntry(req.body);

    console.log(newUser);

    if (
      !newUser.password ||
      !newUser.email ||
      newUser.password.length <= 6 ||
      !newUser.email.includes('@')
    ) {
      return res.status(400).json({ error: 'invalid username or password' });
    }

    // TODO: store this in env
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

    const isEmailUsed = Boolean(
      (
        await pool.query('SELECT USER_ID FROM "USERS" WHERE EMAIL = ($1)', [
          newUser.email,
        ])
      ).rowCount
    );

    if (isEmailUsed) {
      return res.json('Email already in use!');
    }

    const usersInDb = await pool.query('SELECT USER_ID FROM "USERS"');
    const asAdmin = Boolean(!usersInDb.rowCount);

    const dbResponse = await pool.query(
      'INSERT INTO "USERS"(EMAIL, PASSWORD, IS_ADMIN) VALUES ($1, $2, $3) RETURNING *',
      [newUser.email, passwordHash, asAdmin]
    );
    return res.json(dbResponse.rows);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};
