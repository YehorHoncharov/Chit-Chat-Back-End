"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
router.post("/create", message_controller_1.messageController.createMessage);
router.get("/:id", message_controller_1.messageController.getMessage);
router.delete("/:id", message_controller_1.messageController.deleteAllMessagesFromChat);
exports.default = router;
