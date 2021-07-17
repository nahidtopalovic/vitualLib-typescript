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
exports.seedDatabase = void 0;
const mockData_1 = __importDefault(require("./mockData"));
const index_1 = require("./index");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.pool.query('DROP TABLE IF EXISTS "BOOKS" CASCADE');
        yield index_1.pool.query('DROP TABLE IF EXISTS "USERS" CASCADE');
        yield index_1.pool.query('DROP TABLE IF EXISTS "USER_COLLECTIONS" CASCADE');
        yield index_1.pool.query('CREATE TABLE "BOOKS" (BOOK_ID SERIAL PRIMARY KEY, TITLE VARCHAR(100), AUTHOR VARCHAR(100), YEAR INTEGER, EDITION VARCHAR(50))');
        yield index_1.pool.query('CREATE TABLE "USERS" (USER_ID SERIAL PRIMARY KEY, EMAIL VARCHAR(100) UNIQUE, PASSWORD VARCHAR, IS_ADMIN BOOLEAN)');
        yield index_1.pool.query(`CREATE TABLE "USER_COLLECTIONS" (UC_ID SERIAL PRIMARY KEY, USER_ID INTEGER REFERENCES "USERS", BOOK_ID INTEGER REFERENCES "BOOKS")`);
        yield Promise.all(mockData_1.default.map((book) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield index_1.pool.query('INSERT INTO "BOOKS"(TITLE, AUTHOR, YEAR, EDITION) VALUES($1, $2, $3, $4)', [book.title, book.author, book.year_written, book.edition]);
            }
            catch (error) {
                console.log('error' + error);
            }
        })));
        console.log('database seeded');
    }
    catch (err) {
        console.log(err);
    }
});
exports.seedDatabase = seedDatabase;
