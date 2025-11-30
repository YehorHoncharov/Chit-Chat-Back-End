"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("./chat.controller");
const authTokenMiddleware_1 = require("../middlewares/authTokenMiddleware");
const router = express_1.default.Router();
router.post("/create", authTokenMiddleware_1.authTokenMiddleware, chat_controller_1.chatController.createChat);
router.get("/", chat_controller_1.chatController.getChats);
router.get("/:id", chat_controller_1.chatController.getChat);
exports.default = router;
