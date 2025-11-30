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
exports.albumRepository = void 0;
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const client_1 = require("../generated/prisma/client");
function getAlbums() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let post = yield prismaClient_1.default.album.findMany({
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    topic: {
                        select: {
                            tag: true,
                        },
                    },
                },
            });
            return post;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
function createAlbum(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        try {
            let createAlbum = yield prismaClient_1.default.album.create({
                data: data,
                include: {
                    topic: {
                        select: {
                            tag: true,
                        },
                    },
                    images: {
                        select: {
                            image: true,
                        },
                    },
                },
            });
            return createAlbum;
        }
        catch (err) {
            console.log("==================");
            console.log(err);
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code == "P2002") {
                    console.log(err.message);
                    throw err;
                }
            }
        }
    });
}
function editAlbum(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(id);
            return yield prismaClient_1.default.album.update({
                where: { id },
                data,
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    topic: {
                        select: {
                            tag: true,
                        },
                    },
                },
            });
        }
        catch (err) {
            console.log("Error in editAlbum:", err);
            throw err;
        }
    });
}
function deleteAlbum(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedAlbum = yield prismaClient_1.default.album.findUnique({
                where: { id },
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    topic: {
                        select: {
                            tag: true,
                        },
                    },
                },
            });
            if (!deletedAlbum) {
                throw console.log("Album not found!");
            }
            yield prismaClient_1.default.post_app_album_images.deleteMany({
                where: { album_id: id },
            });
            const imageIds = deletedAlbum.images.map((img) => img.image.id);
            yield prismaClient_1.default.image.deleteMany({
                where: { id: { in: imageIds } },
            });
            yield prismaClient_1.default.post_app_album_tags.deleteMany({
                where: { album_id: id },
            });
            yield prismaClient_1.default.album.delete({
                where: { id },
            });
            return deletedAlbum;
        }
        catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    });
}
const albumRepository = {
    getAlbums,
    createAlbum,
    editAlbum,
    deleteAlbum,
};
exports.albumRepository = albumRepository;
