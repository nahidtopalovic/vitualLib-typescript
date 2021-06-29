import { Request, Response, NextFunction } from 'express';

const tokenExtractor = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const authorization: string = request.get('authorization') ?? '';

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }

  next();
};

export { tokenExtractor };
