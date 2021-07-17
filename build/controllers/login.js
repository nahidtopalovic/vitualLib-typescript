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
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const utils_1 = require("../utils");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = utils_1.toNewUserEntry(req.body);
        const userInDb = yield database_1.pool.query('SELECT USER_ID, EMAIL, PASSWORD FROM "USERS" WHERE EMAIL = ($1)', [user.email]);
        const passwordCorrect = userInDb.rowCount
            ? yield bcrypt_1.default.compare(user.password, userInDb.rows[0].password)
            : false;
        if (!userInDb.rowCount || !passwordCorrect) {
            res.status(401).json({ error: 'invalid email or password' });
            return;
        }
        const userForToken = utils_1.toUserForToken(userInDb.rows[0].email, userInDb.rows[0].user_id);
        const secret = process.env.SECRET;
        if (!secret) {
            throw new Error('Environment variable not set');
        }
        const token = jsonwebtoken_1.default.sign(userForToken, secret);
        res.status(200).send({ token, email: user.email });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
});
exports.login = login;
