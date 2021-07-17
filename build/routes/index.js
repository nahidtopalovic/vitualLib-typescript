"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_1 = require("../controllers/book");
const user_1 = require("../controllers/user");
const login_1 = require("../controllers/login");
const collection_1 = require("../controllers/collection");
const middleware_1 = require("../middleware");
const router = express_1.Router();
router.use(middleware_1.tokenExtractor);
const asyncWrapper = (func) => (req, res, next) => {
    Promise.resolve(func(req, res))
        .then(() => next())
        .catch(next);
};
router.get('/book', asyncWrapper(book_1.getBooks)); //listing of all books
router.post('/book', asyncWrapper(book_1.addBook));
router.delete('/book/:id', asyncWrapper(book_1.removeBook));
router.post('/user', asyncWrapper(user_1.signUp));
router.post('/login', asyncWrapper(login_1.login));
router.post('/collection/:id', asyncWrapper(collection_1.addToCollection));
router.delete('/collection/:id', asyncWrapper(collection_1.removeFromCollection));
exports.default = router;
