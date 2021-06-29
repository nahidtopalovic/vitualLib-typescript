import { Router, Response, Request, NextFunction } from 'express';
import { getBooks, addBook, removeBook } from '../controllers/book';
import { signUp } from '../controllers/user';
import { login } from '../controllers/login';
import {
  addToCollection,
  removeFromCollection,
} from '../controllers/collection';
import { tokenExtractor } from '../middleware';

const router = Router();
router.use(tokenExtractor);

const asyncWrapper =
  (func: (a: Request, b: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res))
      .then(() => next())
      .catch(next);
  };

router.get('/book', asyncWrapper(getBooks)); //listing of all books
router.post('/book', asyncWrapper(addBook));
router.delete('/book/:id', asyncWrapper(removeBook));
router.post('/user', asyncWrapper(signUp));
router.post('/login', asyncWrapper(login));
router.post('/collection/:id', asyncWrapper(addToCollection));
router.delete('/collection/:id', asyncWrapper(removeFromCollection));

export default router;
