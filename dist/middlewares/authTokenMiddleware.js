"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTokenMiddleware = authTokenMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../config/token");
function authTokenMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.json({ status: "error", message: "authorization required" });
        return;
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
        res.json({ status: "error", message: "authorization is invalid" });
        return;
    }
    try {
        const decodedToken = (0, jsonwebtoken_1.verify)(token, token_1.SECRET_KEY);
        res.locals.userId = decodedToken.id;
        next();
    }
    catch (error) {
        res.json({ status: "error", message: "token is invalid" });
    }
}
