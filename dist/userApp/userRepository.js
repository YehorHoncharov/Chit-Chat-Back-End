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
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const errorCodes_1 = require("../config/errorCodes");
const prisma_1 = require("../generated/prisma");
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield prismaClient_1.default.profile.findUnique({
                where: {
                    email: email,
                },
            });
            return user;
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
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prismaClient_1.default.profile.create({
                data: data,
            });
            return user;
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
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield prismaClient_1.default.profile.findUnique({
                where: {
                    id: id,
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    surname: true,
                    date_of_birth: true,
                    email: true,
                    password: true,
                    signature: true,
                    image: true,
                    friendship_from: true,
                    friendship_to: true,
                    chat_messages: true,
                    chat_group_members: true,
                    administered_groups: true,
                    // about: true?
                },
            });
            return user;
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
function updateUserById(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = yield prismaClient_1.default.profile.findUnique({
                where: {
                    id: id,
                },
            });
            if (!currentUser) {
                throw new Error("User not found");
            }
            const updatedData = Object.assign(Object.assign({}, currentUser), data);
            const user = yield prismaClient_1.default.profile.update({
                where: {
                    id: id,
                },
                data: {
                    name: updatedData.name,
                    username: updatedData.username,
                    surname: updatedData.surname,
                    date_of_birth: updatedData.date_of_birth,
                    email: updatedData.email,
                    password: updatedData.password,
                    signature: updatedData.signature,
                    image: updatedData.image,
                },
            });
            return user;
        }
        catch (err) {
            console.log(err);
            if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code == "P2002") {
                    console.log(err.message);
                    throw err;
                }
                if (err.code == "P2015") {
                    console.log(err.message);
                    throw err;
                }
                if (err.code == "P20019") {
                    console.log(err.message);
                    throw err;
                }
            }
        }
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prismaClient_1.default.profile.findMany({
                include: {
                    post: true,
                    friendship_from: {
                        include: { profile1: true, profile2: true },
                    },
                    friendship_to: { include: { profile1: true, profile2: true } },
                    chat_group_members: true,
                    administered_groups: true,
                    chat_messages: true,
                },
            });
            return users;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
function updateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prismaClient_1.default.profile.findMany({
                include: {
                    post: true,
                    friendship_from: {
                        include: { profile1: true, profile2: true },
                    },
                    friendship_to: { include: { profile1: true, profile2: true } },
                    chat_group_members: true,
                    administered_groups: true,
                    chat_messages: true,
                },
            });
            return users;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
const userRepository = {
    findUserByEmail: findUserByEmail,
    createUser: createUser,
    getUserById: getUserById,
    updateUserById: updateUserById,
    getUsers: getUsers,
};
exports.default = userRepository;
