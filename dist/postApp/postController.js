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
const postService_1 = __importDefault(require("./postService"));
const fileUtil_1 = require("../utils/fileUtil");
function getPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield postService_1.default.getPosts();
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
        }
    });
}
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newPost = req.body;
            let imagesToProcess = [];
            if (newPost.images) {
                console.log("Original images type:", typeof newPost.images);
                for (const img of newPost.images) {
                    try {
                        const savedPath = yield (0, fileUtil_1.saveBase64Image)(img.url);
                        console.log("Successfully saved image:", savedPath);
                        imagesToProcess.push({ url: savedPath });
                    }
                    catch (imgError) {
                        console.error("Failed to process image:", imgError);
                    }
                }
                newPost.images = imagesToProcess;
            }
            const result = yield postService_1.default.createPost(newPost);
            if (result.status == "error") {
                res.json("error");
            }
            else {
                res.json(result.data);
            }
        }
        catch (error) {
            console.error("Full controller error:", error);
        }
    });
}
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const result = yield postService_1.default.deletePost(+id);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
            console.log("Post deleted successfully");
        }
    });
}
function editPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        let id = req.params.id;
        const result = yield postService_1.default.editPost(body, +id);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result);
        }
    });
}
const postController = {
    createPost,
    deletePost,
    editPost,
    getPosts,
};
exports.default = postController;
