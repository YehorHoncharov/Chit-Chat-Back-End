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
exports.registerFriendshipSocket = registerFriendshipSocket;
const friendshipService_1 = __importDefault(require("./friendshipService"));
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const userSockets = new Map();
function registerFriendshipSocket(socket) {
    userSockets.set(socket.data.userId, socket);
    socket.on("disconnect", () => {
        userSockets.delete(socket.data.userId);
    });
}
function createFriendship(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        body.profile1_id = res.locals.userId;
        const result = yield friendshipService_1.default.createFriendship(body);
        if (result.status == "error") {
            res.json(result);
        }
        else {
            res.json(result.data);
        }
    });
}
function getFriendship(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield friendshipService_1.default.getFriendship();
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
        }
    });
}
function acceptFriendship(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = req.body;
        const id = res.locals.userId;
        const where = { profile1_id: data.id, profile2_id: +id };
        const result = yield friendshipService_1.default.acceptFriendship(where);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
        }
    });
}
function deleteFriendship(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.userId;
        const { id: otherUserId } = req.body;
        const user = yield prismaClient_1.default.profile.findUnique({
            where: { id: userId },
            select: { name: true, surname: true },
        });
        const fullName = user ? `${user.name} ${user.surname}` : "Користувач";
        const deletedFriendship = yield friendshipService_1.default.deleteFriendship(userId, otherUserId);
        if (!deletedFriendship) {
            res.json({ error: "Friendship not found" });
        }
        const senderSocket = userSockets.get(otherUserId);
        if (senderSocket) {
            senderSocket.emit("friendRequestDeclined", {
                requestId: otherUserId,
                message: `Користувач ${fullName} відхилив ваш запит на дружбу.`,
            });
        }
        res.json({ success: true });
    });
}
const friendshipController = {
    createFriendship: createFriendship,
    getFriendship: getFriendship,
    acceptFriendship,
    deleteFriendship,
};
exports.default = friendshipController;
