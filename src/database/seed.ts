import books from './mockData';
import { client } from './index';

export const seedDatabase = async (): Promise<void> => {
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query('DROP TABLE IF EXISTS "BOOKS"');
    await client.query(
      'CREATE TABLE "BOOKS" (BOOK_ID SERIAL PRIMARY KEY, TITLE VARCHAR(100), AUTHOR VARCHAR(100), YEAR INTEGER, EDITION VARCHAR(50))'
    );
    await client.query(
      'CREATE TABLE "USERS" (USER_ID SERIAL PRIMARY KEY, EMAIL VARCHAR(100) UNIQUE, PASSWORD VARCHAR, ISADMIN BOOLEAN)'
    );

    await client.query(
      `CREATE TABLE "USERCOLLECTIONS" (UC_ID SERIAL PRIMARY KEY, USER_ID INTEGER REFERENCES "USERS", BOOK_ID INTEGER REFERENCES "BOOKS")`
    );

    const text =
      'INSERT INTO "BOOKS"(TITLE, AUTHOR, YEAR, EDITION) VALUES($1, $2, $3, $4)';

    await Promise.all(
      books.map(async (book) => {
        try {
          await client.query(text, Object.values(book));
        } catch (error) {
          console.log('error' + error);
        }
      })
    );
    console.log('complete all');

    await client.query('COMMIT');
    console.log('database seeded');
  } catch (err) {
    await client.query('ROLLBACK');
    console.log(err);
  }
};
