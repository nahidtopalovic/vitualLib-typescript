import { Book, User, UserForToken } from './types';

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

// toUserForToken

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

// toNewBook

const parseTitle = (title: unknown): string => {
  if (!title || !isString(title)) {
    throw new Error('Incorrect or missing title');
  }
  return title;
};

const parseAuthor = (author: unknown): string => {
  if (!author || !isString(author)) {
    throw new Error('Incorrect or missing author');
  }
  return author;
};

const parseEdition = (edition: unknown): string => {
  if (!edition || !isString(edition)) {
    throw new Error('Incorrect or missing edition');
  }
  return edition;
};

const parseYear = (year_written: unknown): number => {
  if (!year_written || !isNumber(year_written)) {
    throw new Error('Incorrect or missing id: ' + year_written);
  }
  return year_written;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewBook = (object: any): Book => {
  const newBook: Book = {
    title: parseTitle(object.title),
    author: parseAuthor(object.author),
    edition: parseEdition(object.edition),
    year_written: parseYear(object.year_written),
  };

  return newBook;
};

export { toNewUserEntry, toUserForToken, toNewBook };
