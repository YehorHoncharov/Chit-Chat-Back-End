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
exports.chatSocketController = void 0;
exports.setSocketServerInstance = setSocketServerInstance;
const chat_service_1 = require("./chat.service");
let io;
function leaveChat(socket, data) {
    const chatRoomName = `chat_${data.chatId}`;
    socket.leave(chatRoomName);
}
function joinChat(socket, data, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatRoomName = `chat_${data.chatId}`;
        socket.join(chatRoomName);
        const result = yield chat_service_1.chatService.joinChat(data.chatId);
        if (result.status === "success") {
            if (typeof callback === "function") {
                callback({ status: "success", data: result.data });
            }
        }
    });
}
function updateChat(socket, data) {
}
function registerChat(socket) {
    socket.on("joinChat", (data, callback) => {
        joinChat(socket, data, callback);
    });
    socket.on("leaveChat", (data) => {
        leaveChat(socket, data);
    });
    socket.on("sendMessage", (data) => __awaiter(this, void 0, void 0, function* () {
        yield chat_service_1.chatService.saveMessage(data);
        const room = `chat_${data.chat_groupId}`;
        io.to(room).emit("newMessage", data);
    }));
}
function setSocketServerInstance(ioInstance) {
    io = ioInstance;
}
exports.chatSocketController = {
    registerChat,
    updateChat,
    joinChat,
    leaveChat,
};
