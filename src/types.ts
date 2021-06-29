/* eslint-disable prettier/prettier */
export interface Book {
  title: string,
  author: string,
  year_written: number,
  edition: string,
}

export interface User {
  email: string,
  password: string,
}

export interface UserForToken {
  email: string,
  id: number
}

export interface MyToken {
  email: string;
  id: number;
}