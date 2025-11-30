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
exports.chatService = void 0;
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const chat_repository_1 = __importDefault(require("./chat.repository"));
function createChat(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingChat = yield prismaClient_1.default.chatGroup.findFirst({
            where: { name: data.name },
            include: {
                members: true,
            },
        });
        const result = yield chat_repository_1.default.createChat(data);
        if (!result) {
            return { status: "error", message: "Error" };
        }
        return { status: "success", data: result };
    });
}
function getChat(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield chat_repository_1.default.getChat({ id });
        if (!result) {
            return { status: "error", message: "Error" };
        }
        return { status: "success", data: result };
    });
}
function getChats() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield chat_repository_1.default.getAllChats();
        if (!result) {
            return { status: "error", message: "Error" };
        }
        return { status: "success", data: result };
    });
}
function joinChat(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield chat_repository_1.default.getChat({ id: id });
        if (!result) {
            return { status: "error", message: "Error" };
        }
        return { status: "success", data: result };
    });
}
function saveMessage(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.default.chatMessage.create({
                data: data,
            });
        }
        catch (error) {
            console.error("Ошибка при сохранении сообщения:", error);
        }
    });
}
exports.chatService = {
    createChat,
    getChat,
    joinChat,
    getChats,
    saveMessage,
};
