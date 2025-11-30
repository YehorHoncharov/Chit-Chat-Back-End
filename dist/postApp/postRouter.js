"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("./postController"));
const router = express_1.default.Router();
router.post("/create", postController_1.default.createPost);
router.delete("/:id", postController_1.default.deletePost);
router.put("/:id", postController_1.default.editPost);
router.get("/", postController_1.default.getPosts);
exports.default = router;
