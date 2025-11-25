"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authTokenMiddleware_1 = require("../middlewares/authTokenMiddleware");
const friendshipController_1 = __importDefault(require("./friendshipController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/all', friendshipController_1.default.getFriendship);
router.post('/create', authTokenMiddleware_1.authTokenMiddleware, friendshipController_1.default.createFriendship);
router.put('/acceptFriendship', authTokenMiddleware_1.authTokenMiddleware, friendshipController_1.default.acceptFriendship);
router.delete('/deleteFriendship', authTokenMiddleware_1.authTokenMiddleware, friendshipController_1.default.deleteFriendship);
exports.default = router;
