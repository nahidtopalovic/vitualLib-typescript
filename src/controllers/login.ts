import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { pool } from '../database';
import { toNewUserEntry, toUserForToken } from '../utils';
import { UserForToken } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const user = toNewUserEntry(req.body);

    const userInDb = await pool.query(
      'SELECT USER_ID, EMAIL, PASSWORD FROM "USERS" WHERE EMAIL = ($1)',
      [user.email]
    );

    const passwordCorrect = userInDb.rowCount
      ? await bcrypt.compare(user.password, userInDb.rows[0].password)
      : false;

    if (!userInDb.rowCount || !passwordCorrect) {
      res.status(401).json({ error: 'invalid email or password' });
      return;
    }

    const userForToken: UserForToken = toUserForToken(
      userInDb.rows[0].email,
      userInDb.rows[0].user_id
    );

    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error('Environment variable not set');
    }
    const token = jwt.sign(userForToken, secret);

    res.status(200).send({ token, email: user.email });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return;
  }
};
