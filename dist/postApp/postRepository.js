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
exports.postRepository = void 0;
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const client_1 = require("../generated/prisma/client");
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let post = yield prismaClient_1.default.post.findMany({
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    tags: {
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
function createPost(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let createPost = yield prismaClient_1.default.post.create({
                data: data,
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                },
            });
            return createPost;
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (err.code == "P2002") {
                    console.log(err.message);
                    throw err;
                }
            }
        }
    });
}
function editPost(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.default.post.update({
                where: { id },
                data,
                include: {
                    images: {
                        select: {
                            image: true,
                        },
                    },
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                },
            });
        }
        catch (err) {
            console.log("Error in editPost:", err);
            throw err;
        }
    });
}
function deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postToDelete = yield prismaClient_1.default.post.findUnique({
                where: { id },
                include: {
                    images: {
                        include: {
                            image: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                },
            });
            if (!postToDelete) {
                throw console.log("Post not found!");
            }
            yield prismaClient_1.default.post_app_post_image.deleteMany({
                where: { post_id: id },
            });
            const imageIds = postToDelete.images.map((img) => img.image.id);
            yield prismaClient_1.default.image.deleteMany({
                where: { id: { in: imageIds } },
            });
            yield prismaClient_1.default.post_app_post_tag.deleteMany({
                where: { post_id: id },
            });
            yield prismaClient_1.default.post.delete({
                where: { id },
            });
            return postToDelete;
        }
        catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    });
}
const postRepository = {
    getPosts,
    createPost,
    editPost,
    deletePost,
};
exports.postRepository = postRepository;
