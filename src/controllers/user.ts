import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../database';
import { toNewUserEntry } from '../utils';

const signUp = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newUser = toNewUserEntry(req.body);

    console.log(newUser);

    if (
      !(newUser.password && newUser.email) ||
      !(newUser.password.length > 6 && newUser.email.includes('@'))
    ) {
      return res.status(400).json({ error: 'invalid username or password' });
    }

    // TODO: store this in env
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

    await pool.connect();

    const usersInDb = (await pool.query('SELECT USER_ID FROM "USERS"'))
      .rowCount;

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

    if (!usersInDb) {
      const textAdmin =
        'INSERT INTO "USERS"(EMAIL, PASSWORD, ISADMIN) VALUES ($1, $2, $3) RETURNING *';
      const dbResponse = await pool.query(textAdmin, [
        newUser.email,
        passwordHash,
        true,
      ]);

      return res.json(dbResponse.rows);
    }

    const text =
      'INSERT INTO "USERS"(EMAIL, PASSWORD) VALUES ($1, $2) RETURNING *';
    const dbResponse = await pool.query(text, [newUser.email, passwordHash]);
    return res.json(dbResponse.rows);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

export { signUp };
