import { User, UserForToken } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseEmail = (email: unknown): string => {
  if (!email || !isString(email)) {
    throw new Error('Incorrect or missing email');
  }
  return email;
};

const parsePassword = (password: unknown): string => {
  if (!password || !isString(password)) {
    throw new Error('Incorrect or missing password');
  }

  return password;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewUserEntry = (object: any): User => {
  const newUser: User = {
    email: parseEmail(object.email),
    password: parsePassword(object.password),
  };

  return newUser;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number';
};

const parseId = (id: unknown): number => {
  if (!id || !isNumber(id)) {
    throw new Error('Incorrect or missing id: ' + id);
  }
  return id;
};

const toUserForToken = (email: unknown, id: unknown): UserForToken => {
  const userForToken: UserForToken = {
    email: parseEmail(email),
    id: parseId(id),
  };

  return userForToken;
};

export { toNewUserEntry, toUserForToken };
