import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';
import { pool } from '../database';
import { toNewUserEntry, toUserForToken } from '../utils';
import { UserForToken } from '../types';

const login = async (req: Request, res: Response) => {
  try {
    const user = toNewUserEntry(req.body);

    const userInDb = await pool.query(
      'SELECT USER_ID, PASSWORD FROM "USERS" WHERE EMAIL = ($1)',
      [user.email]
    );
    const passwordCorrect = userInDb
      ? await bcrypt.compare(user.password, userInDb.rows[0].password)
      : false;

    if (!(user && passwordCorrect)) {
      return res.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken: UserForToken = toUserForToken(
      userInDb.rows[0].email,
      userInDb.rows[0].id
    );

    const token = jwt.sign(userForToken, process.env['SECRET']);

    return res.status(200).send({ token, email: user.email });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

export { login };
