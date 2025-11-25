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
const albumService_1 = __importDefault(require("./albumService"));
function getAlbums(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield albumService_1.default.getAlbums();
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
        }
    });
}
function createAlbum(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        body.author_id = res.locals.userId;
        const result = yield albumService_1.default.createAlbum(body);
        if (result.status == "error") {
            res.json(result);
        }
        else {
            res.json(result.data);
        }
    });
}
function deleteAlbum(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const result = yield albumService_1.default.deleteAlbum(+id);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result.data);
            console.log("Post deleted successfully");
        }
    });
}
function editAlbum(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = req.body;
        let id = req.params.id;
        const result = yield albumService_1.default.editAlbum(body, +id);
        if (result.status == "error") {
            res.json("error");
        }
        else {
            res.json(result);
        }
    });
}
const albumController = {
    createAlbum,
    deleteAlbum,
    editAlbum,
    getAlbums,
};
exports.default = albumController;
