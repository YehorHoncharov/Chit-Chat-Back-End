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
const prisma_1 = require("../generated/prisma");
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const errorCodes_1 = require("../config/errorCodes");
function createMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(data);
            const message = yield prismaClient_1.default.chatMessage.create({
                data: data,
            });
            return message;
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code in Object.keys(errorCodes_1.errors)) {
                    const errorKey = error.code;
                    console.log(errorCodes_1.errors[errorKey]);
                }
            }
        }
    });
}
function getMessage(where) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = yield prismaClient_1.default.chatMessage.findUniqueOrThrow({
                where: where,
            });
            return message;
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code in Object.keys(errorCodes_1.errors)) {
                    const errorKey = error.code;
                    console.log(errorCodes_1.errors[errorKey]);
                }
            }
        }
    });
}
function deleteAllMessagesFromChat(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield prismaClient_1.default.chatMessage.deleteMany({
            where: { chat_groupId: chatId },
        });
        return { deletedCount: result.count };
    });
}
const messageRepository = {
    createMessage,
    getMessage,
    deleteAllMessagesFromChat,
};
exports.default = messageRepository;
