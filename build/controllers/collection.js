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
exports.removeFromCollection = exports.addToCollection = void 0;
const database_1 = require("../database");
const jsonwebtoken_1 = require("jsonwebtoken");
const addToCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.id;
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
        const bookInLibrary = Boolean((yield database_1.pool.query('SELECT BOOK_ID, TITLE FROM "BOOKS" WHERE BOOK_ID = ($1)', [bookId])).rowCount);
        if (!bookInLibrary) {
            res.status(404).json({ error: 'Invalid book id' });
            return;
        }
        const isBookInCollection = Boolean((yield database_1.pool.query('SELECT BOOK_ID FROM "USER_COLLECTIONS" WHERE BOOK_ID = $1 AND USER_ID = $2', [bookId, decodedToken.id])).rowCount);
        if (isBookInCollection) {
            res.status(400).json({ error: 'Book is already in the collection' });
            return;
        }
        const response = yield database_1.pool.query('INSERT INTO "USER_COLLECTIONS" (BOOK_ID, USER_ID) VALUES ($1, $2) RETURNING *', [bookId, decodedToken.id]);
        res.status(201).json(response.rows[0]);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.addToCollection = addToCollection;
const removeFromCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collectionId = Number(req.params.id);
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
        const isBookInCollection = Boolean((yield database_1.pool.query('SELECT BOOK_ID FROM "USER_COLLECTIONS" WHERE UC_ID = $1 AND user_id = $2', [collectionId, decodedToken.id])).rowCount);
        if (!isBookInCollection) {
            res.status(400).json({ error: 'Book is not in the collection' });
            return;
        }
        const response = yield database_1.pool.query('DELETE FROM "USER_COLLECTIONS" WHERE UC_ID = $1', [collectionId]);
        res.status(200).json(response.rows[0]);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.removeFromCollection = removeFromCollection;
