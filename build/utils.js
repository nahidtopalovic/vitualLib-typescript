"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewBook = exports.toUserForToken = exports.toNewUserEntry = void 0;
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseEmail = (email) => {
    if (!email || !isString(email)) {
        throw new Error('Incorrect or missing email');
    }
    return email;
};
const parsePassword = (password) => {
    if (!password || !isString(password)) {
        throw new Error('Incorrect or missing password');
    }
    return password;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewUserEntry = (object) => {
    const newUser = {
        email: parseEmail(object.email),
        password: parsePassword(object.password),
    };
    return newUser;
};
exports.toNewUserEntry = toNewUserEntry;
// toUserForToken
const isNumber = (num) => {
    return typeof num === 'number';
};
const parseId = (id) => {
    if (!id || !isNumber(id)) {
        throw new Error('Incorrect or missing id: ' + id);
    }
    return id;
};
const toUserForToken = (email, id) => {
    const userForToken = {
        email: parseEmail(email),
        id: parseId(id),
    };
    return userForToken;
};
exports.toUserForToken = toUserForToken;
// toNewBook
const parseTitle = (title) => {
    if (!title || !isString(title)) {
        throw new Error('Incorrect or missing title');
    }
    return title;
};
const parseAuthor = (author) => {
    if (!author || !isString(author)) {
        throw new Error('Incorrect or missing author');
    }
    return author;
};
const parseEdition = (edition) => {
    if (!edition || !isString(edition)) {
        throw new Error('Incorrect or missing edition');
    }
    return edition;
};
const parseYear = (year_written) => {
    if (!year_written || !isNumber(year_written)) {
        throw new Error('Incorrect or missing id: ' + year_written);
    }
    return year_written;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewBook = (object) => {
    const newBook = {
        title: parseTitle(object.title),
        author: parseAuthor(object.author),
        edition: parseEdition(object.edition),
        year_written: parseYear(object.year_written),
    };
    return newBook;
};
exports.toNewBook = toNewBook;
