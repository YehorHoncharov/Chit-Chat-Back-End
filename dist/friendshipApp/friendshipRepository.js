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
function createFriendship(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const friendship = yield prismaClient_1.default.friendship.create({
                data: {
                    profile1_id: data.profile1_id,
                    profile2_id: data.profile2_id,
                }
            });
            return friendship;
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
function getFriendship() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let friendship = yield prismaClient_1.default.friendship.findMany();
            return friendship;
        }
        catch (err) {
            if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code == 'P2002') {
                    console.log(err.message);
                    throw err;
                }
                if (err.code == 'P2015') {
                    console.log(err.message);
                    throw err;
                }
                if (err.code == 'P20019') {
                    console.log(err.message);
                    throw err;
                }
            }
        }
    });
}
function updateFriendship(data, where) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.default.friendship.update({
                where: where,
                data,
            });
        }
        catch (err) {
            console.log("Error in updateFriendship:", err);
            throw err;
        }
    });
}
function deleteFriendship(profile1Id, profile2Id) {
    return __awaiter(this, void 0, void 0, function* () {
        const friendship = yield prismaClient_1.default.friendship.findFirst({
            where: {
                OR: [
                    { profile1_id: profile1Id, profile2_id: profile2Id },
                    { profile1_id: profile2Id, profile2_id: profile1Id },
                ],
            },
        });
        if (!friendship) {
            console.error("Friendship not found between", profile1Id, "and", profile2Id);
            return null;
        }
        yield prismaClient_1.default.friendship.delete({
            where: {
                profile1_id_profile2_id: {
                    profile1_id: friendship.profile1_id,
                    profile2_id: friendship.profile2_id,
                },
            },
        });
        return friendship;
    });
}
const friendshipRepository = {
    createFriendship: createFriendship,
    getFriendship: getFriendship,
    updateFriendship: updateFriendship,
    deleteFriendship: deleteFriendship
};
exports.default = friendshipRepository;
