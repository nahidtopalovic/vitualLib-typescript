"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenExtractor = void 0;
const tokenExtractor = (request, _response, next) => {
    var _a;
    const authorization = (_a = request.get('authorization')) !== null && _a !== void 0 ? _a : '';
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    }
    else {
        request.token = null;
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
