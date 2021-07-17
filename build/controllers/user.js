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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../database");
const utils_1 = require("../utils");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const newUser = utils_1.toNewUserEntry(req.body);
        console.log(newUser);
        if (!newUser.password ||
            !newUser.email ||
            newUser.password.length <= 6 ||
            !newUser.email.includes('@')) {
            res.status(400).json({ error: 'invalid username or password' });
            return;
        }
        const saltRounds = process.env.SALTROUNDS;
        if (!saltRounds) {
            throw new Error('Environment variable not set');
        }
        const passwordHash = yield bcrypt_1.default.hash(newUser.password, saltRounds);
        const isEmailUsed = Boolean((yield database_1.pool.query('SELECT USER_ID FROM "USERS" WHERE EMAIL = ($1)', [
            newUser.email,
        ])).rowCount);
        if (isEmailUsed) {
            res.json('Email already in use!');
            return;
        }
        const usersInDb = yield database_1.pool.query('SELECT USER_ID FROM "USERS"');
        const asAdmin = Boolean(!usersInDb.rowCount);
        const dbResponse = yield database_1.pool.query('INSERT INTO "USERS"(EMAIL, PASSWORD, IS_ADMIN) VALUES ($1, $2, $3) RETURNING *', [newUser.email, passwordHash, asAdmin]);
        res.status(201).json(dbResponse.rows);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.signUp = signUp;
