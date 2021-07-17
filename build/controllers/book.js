"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBook = exports.addBook = exports.getBooks = void 0;
const database_1 = require("../database");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../utils");
const getBooks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield database_1.pool.query('SELECT BOOK_ID, TITLE, AUTHOR, YEAR, EDITION FROM "BOOKS"');
        res.status(200).json(response.rows);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json('Internal error');
        return;
    }
});
exports.getBooks = getBooks;
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBook = utils_1.toNewBook(req.body);
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error('Environment variable not set');
        }
        if (!req.token) {
            res.status(403).json({ error: 'token missing' });
            return;
        }
        const decodedToken = jsonwebtoken_1.verify(req.token, secret);
        if (!decodedToken.id) {
            res.status(403).json({ error: 'invalid token' });
            return;
        }
        const usersInDb = yield database_1.pool.query('SELECT USER_ID, EMAIL, IS_ADMIN FROM "USERS" WHERE USER_ID = $1', [decodedToken.id]);
        const isAdmin = Boolean(usersInDb.rows[0].is_admin);
        if (!isAdmin) {
            res.status(401).json({ error: 'Invalid permissions' });
            return;
        }
        const response = yield database_1.pool.query('INSERT INTO "BOOKS"(TITLE, AUTHOR, YEAR, EDITION) VALUES($1, $2, $3, $4) RETURNING *', [newBook.title, newBook.author, newBook.year_written, newBook.edition]);
        res.status(201).json(response.rows[0]);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.addBook = addBook;
const removeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = Number(req.params.id);
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error('Environment variable not set');
        }
        if (!req.token) {
            res.status(403).json({ error: 'token missing' });
            return;
        }
        const decodedToken = jsonwebtoken_1.verify(req.token, secret);
        if (!decodedToken.id) {
            res.status(403).json({ error: 'invalid token' });
            return;
        }
        const usersInDb = yield database_1.pool.query('SELECT USER_ID, EMAIL, IS_ADMIN FROM "USERS" WHERE USER_ID = $1', [decodedToken.id]);
        const isAdmin = Boolean(usersInDb.rows[0].is_admin);
        if (!isAdmin) {
            res.status(401).json({ error: 'Invalid permissions' });
            return;
        }
        const bookInLibrary = Boolean((yield database_1.pool.query('SELECT BOOK_ID FROM "BOOKS" WHERE BOOK_ID = ($1)', [
            bookId,
        ])).rowCount);
        if (!bookInLibrary) {
            res.status(404).json({ error: 'Invalid book id' });
            return;
        }
        yield database_1.pool.query('DELETE FROM "BOOKS" WHERE BOOK_ID = $1', [bookId]);
        res.status(200).json('Book removed!');
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.removeBook = removeBook;
