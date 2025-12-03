import express from "express";
import { messageController } from "./messageController";

const router = express.Router();

router.post("/create", messageController.createMessage);
router.get("/:id", messageController.getMessage);
router.delete("/:id", messageController.deleteAllMessagesFromChat);

export default router;
