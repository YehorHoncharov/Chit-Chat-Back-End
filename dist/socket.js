"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketServer = initSocketServer;
const socket_io_1 = require("socket.io");
const chat_socket_controller_1 = require("./Chats/chat.socket.controller");
const socketAuthMiddleware_1 = require("./middlewares/socketAuthMiddleware");
const friendshipController_1 = require("./friendshipApp/friendshipController");
function initSocketServer(httpServer) {
    const ioServer = new socket_io_1.Server(httpServer);
    (0, chat_socket_controller_1.setSocketServerInstance)(ioServer);
    ioServer.use(socketAuthMiddleware_1.socketAuthMiddleware);
    ioServer.on("connection", (socket) => {
        (0, friendshipController_1.registerFriendshipSocket)(socket);
        chat_socket_controller_1.chatSocketController.registerChat(socket);
    });
}
