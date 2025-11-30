"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./userController"));
const authTokenMiddleware_1 = require("../middlewares/authTokenMiddleware");
const router = express_1.default.Router();
router.post("/reg", userController_1.default.registerUser);
router.post("/log", userController_1.default.loginUser);
router.post("/sendCode", userController_1.default.sendCode);
router.get("/me", authTokenMiddleware_1.authTokenMiddleware, userController_1.default.getUserById);
router.get("/all", userController_1.default.getUsers);
router.put("/:id", userController_1.default.updateUserById);
router.get("/:id", userController_1.default.getUserByReqId);
exports.default = router;
