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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("./userService"));
function sendCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const resultEmail = yield userService_1.default.sendEmail(data.email);
        res.json(resultEmail);
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = req.body;
        const result = yield userService_1.default.login(data.email, data.password);
        res.json(result);
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = res.locals.userId;
        const result = yield userService_1.default.getUserById(+id);
        res.json(result);
    });
}
function getUserByReqId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = req.params.id;
        const result = yield userService_1.default.getUserById(+id);
        res.json(result);
    });
}
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let _a = req.body, { code } = _a, user = __rest(_a, ["code"]);
        const verificationResult = yield userService_1.default.verifyCode(user.email, code);
        if (!verificationResult.success) {
            console.log(verificationResult);
            res.json(verificationResult);
            return;
        }
        const resultUser = yield userService_1.default.registration(user);
        res.json(resultUser);
    });
}
function updateUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let id = +req.params.id;
        let data = req.body;
        const user = yield userService_1.default.updateUserById(data, id);
        if (user.status == "error") {
            res.send("error");
        }
        else {
            res.json(user.data);
        }
    });
}
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const context = yield userService_1.default.getUsers();
        if (context.status == "error") {
            res.send("error");
        }
        else {
            res.json(context.data);
        }
    });
}
const userController = {
    registerUser,
    loginUser,
    getUserById,
    sendCode,
    updateUserById,
    getUsers,
    getUserByReqId,
};
exports.default = userController;
