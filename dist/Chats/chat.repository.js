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
function createChat(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const correctedData = {
                name: data.name,
                is_personal_chat: data.is_personal_chat,
                avatar: data.avatar,
                admin_id: data.admin_id,
                members: Array.isArray(data.members)
                    ? {
                        create: data.members.map(member => ({
                            profile_id: member.id
                        }))
                    }
                    : undefined
            };
            const chatGroup = yield prismaClient_1.default.chatGroup.create({
                data: correctedData,
                include: {
                    members: true,
                    admin: true
                }
            });
            return chatGroup;
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                console.error(`Prisma error code: ${error.code}, message: ${error.message}, meta:`, error.meta);
                if (error.code in Object.keys(errorCodes_1.errors)) {
                    const errorKey = error.code;
                    console.error(errorCodes_1.errors[errorKey]);
                }
            }
            else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }
    });
}
function getAllChats() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chat = yield prismaClient_1.default.chatGroup.findMany({
                include: {
                    chat_messages: true,
                    members: true,
                    admin: true,
                }
            });
            return chat;
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
function getChat(where) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chat = yield prismaClient_1.default.chatGroup.findUniqueOrThrow({
                where: where,
                include: {
                    chat_messages: true,
                    members: true,
                    admin: true
                }
            });
            return chat;
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
const chatRepository = {
    createChat,
    getChat,
    getAllChats,
};
exports.default = chatRepository;
