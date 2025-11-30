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
exports.messageController = void 0;
const message_service_1 = require("./message.service");
function createMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        body.ownerId = res.locals.userId;
        const result = yield message_service_1.messageService.createMessage(body);
        if (result.status == "error") {
            return;
        }
        res.json(result);
    });
}
function getMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const result = yield message_service_1.messageService.getMessage(+id);
        if (result.status == "error") {
            return;
        }
        res.json(result);
    });
}
function deleteAllMessagesFromChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const result = yield message_service_1.messageService.deleteAllMessagesFromChat(+id);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
            console.log("Message deleted successfully");
        }
    });
}
exports.messageController = {
    getMessage,
    createMessage,
    deleteAllMessagesFromChat,
};
