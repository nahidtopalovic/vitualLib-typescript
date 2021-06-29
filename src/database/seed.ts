import books from './mockData';
import { pool } from './index';

export const seedDatabase = async (): Promise<void> => {
  try {
    await pool.query('DROP TABLE IF EXISTS "BOOKS"');
    await pool.query(
      'CREATE TABLE "BOOKS" (BOOK_ID SERIAL PRIMARY KEY, TITLE VARCHAR(100), AUTHOR VARCHAR(100), YEAR INTEGER, EDITION VARCHAR(50))'
    );
    await pool.query(
      'CREATE TABLE "USERS" (USER_ID SERIAL PRIMARY KEY, EMAIL VARCHAR(100) UNIQUE, PASSWORD VARCHAR, IS_ADMIN BOOLEAN)'
    );

    await pool.query(
      `CREATE TABLE "USER_COLLECTIONS" (UC_ID SERIAL PRIMARY KEY, USER_ID INTEGER REFERENCES "USERS", BOOK_ID INTEGER REFERENCES "BOOKS")`
    );

    await Promise.all(
      books.map(async (book) => {
        try {
          await pool.query(
            'INSERT INTO "BOOKS"(TITLE, AUTHOR, YEAR, EDITION) VALUES($1, $2, $3, $4)',
            [book.title, book.author, book.year_written, book.edition]
          );
        } catch (error) {
          console.log('error' + error);
        }
      })
    );
    console.log('database seeded');
  } catch (err) {
    console.log(err);
  }
};
