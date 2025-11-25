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
exports.chatController = void 0;
const chat_service_1 = require("./chat.service");
function getChats(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const chat = yield chat_service_1.chatService.getChats();
        res.json(chat);
    });
}
function getChat(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const chat = yield chat_service_1.chatService.getChat(+id);
        res.json(chat);
    });
}
function createChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        data.admin_id = res.locals.userId;
        const chat = yield chat_service_1.chatService.createChat(data);
        res.json(chat);
    });
}
exports.chatController = {
    createChat,
    getChat,
    getChats,
};
