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
exports.socketAuthMiddleware = socketAuthMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../config/token");
function socketAuthMiddleware(socket, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = socket.handshake.auth.token;
        if (!token) {
            next(new Error("no token"));
            return;
        }
        try {
            const decodedToken = (0, jsonwebtoken_1.verify)(token, token_1.SECRET_KEY);
            socket.data.userId = decodedToken.id;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
