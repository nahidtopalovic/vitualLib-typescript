import { Router, Response, Request, NextFunction } from 'express';
const router = Router();

import { ping, getBooks } from '../controllers/books';
import { signUp } from '../controllers/user';
import { login } from '../controllers/login';

const asyncWrapper =
  (func: (a: Request, b: Response) => Promise<Response>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res))
      .then(() => next())
      .catch(next);
  };

router.get('/ping', ping);
router.get('/books', asyncWrapper(getBooks)); //listing of all books
router.post('/user', asyncWrapper(signUp));
router.post('/login', asyncWrapper(login));

export default router;
