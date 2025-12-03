import express from "express";
import { chatController } from "./chatController";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";

const router = express.Router();

router.post("/create", authTokenMiddleware, chatController.createChat);
router.get("/", chatController.getChats);
router.get("/:id", chatController.getChat);

export default router;
