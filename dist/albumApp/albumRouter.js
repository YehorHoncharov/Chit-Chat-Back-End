"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const albumController_1 = __importDefault(require("./albumController"));
const authTokenMiddleware_1 = require("../middlewares/authTokenMiddleware");
const router = express_1.default.Router();
router.get('/', albumController_1.default.getAlbums);
router.post('/create', authTokenMiddleware_1.authTokenMiddleware, albumController_1.default.createAlbum);
router.delete('/:id', albumController_1.default.deleteAlbum);
router.put('/:id', albumController_1.default.editAlbum);
exports.default = router;
