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
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../config/token");
const userRepository_1 = __importDefault(require("./userRepository"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const __1 = require("..");
const emailCodes = new Map();
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.default.getUserById(id);
            if (!user) {
                return { status: "error", message: "User not found" };
            }
            return { status: "success", data: user };
        }
        catch (err) {
            if (err instanceof Error) {
                return { status: "error", message: err.message };
            }
            return { status: "error", message: "Internal server error" };
        }
    });
}
function login(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.default.findUserByEmail(email);
            if (!user) {
                return { status: "error", message: "User not found" };
            }
            if (typeof user === "string") {
                return { status: "error", message: user };
            }
            if (password !== user.password) {
                return { status: "error", message: "Passwords didn`t match" };
            }
            const token = (0, jsonwebtoken_1.sign)({ id: user.id }, token_1.SECRET_KEY, { expiresIn: "7d" });
            return { status: "success", data: token };
        }
        catch (err) {
            if (err instanceof Error) {
                return { status: "error", message: err.message };
            }
            return { status: "error", message: "Internal server error" };
        }
    });
}
function registration(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.default.findUserByEmail(userData.email);
            if (user) {
                return { status: "error", message: "User already exists" };
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(userData.password, 10);
            const hashedUserData = Object.assign(Object.assign({}, userData), { password: hashedPassword });
            const newData = Object.assign(Object.assign({}, userData), { image: "uploads/user.png" });
            const newUser = yield userRepository_1.default.createUser(hashedUserData);
            console.log(newData);
            if (!newUser) {
                return { status: "error", message: "User is not created" };
            }
            const token = (0, jsonwebtoken_1.sign)({ id: newUser.id }, token_1.SECRET_KEY, { expiresIn: "1d" });
            return { status: "success", data: token };
        }
        catch (err) {
            if (err instanceof Error) {
                return { status: "error", message: err.message };
            }
            return { status: "error", message: "An unknown error occurred" };
        }
    });
}
function sendEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const generateCode = () => {
            return Math.floor(100000 + Math.random() * 900000).toString();
        };
        const code = generateCode();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        emailCodes.set(email, { code, expiresAt });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "honcharovstallker@gmail.com",
                pass: "qxja qfuk urdy qihr",
            },
        });
        const mailOptions = {
            from: "chitchatbyteam1@gmail.com",
            to: email,
            subject: "Код подтверждения",
            text: code,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("Письмо отправлено:", info.response, " Код:", code);
            return { success: true, code };
        }
        catch (err) {
            console.error("Ошибка отправки:", err);
            return { status: "error", message: "Не удалось отправить письмо" };
        }
    });
}
function verifyCode(email, userInputCode) {
    const storedData = emailCodes.get(email);
    if (!storedData) {
        return { status: "error", message: "Код не найден или устарел" };
    }
    const { code, expiresAt } = storedData;
    console.log(code, "/", userInputCode);
    if (Date.now() > expiresAt) {
        emailCodes.delete(email);
        console.log(emailCodes);
        return { status: "error", message: "Код истёк" };
    }
    if (userInputCode !== code) {
        return { status: "error", message: "Невірний код!" };
    }
    emailCodes.delete(email);
    return { success: true };
}
function saveCode(email, code) {
    console.log(email + " bebebebeb");
    const normalizedEmail = email.trim().toLowerCase();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    emailCodes.set(normalizedEmail, { code, expiresAt });
}
function updateUserById(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const createdImageFilename = [];
        try {
            const uploadDir = path_1.default.join(__dirname, "..", "..", "public", "uploads");
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
            let updateData = Object.assign({}, data);
            if (updateData.image &&
                typeof updateData.image === "string" &&
                updateData.image.startsWith("data:image")) {
                const matches = updateData.image.match(/^data:image\/(\w+);base64,(.+)$/);
                if (!matches) {
                    return {
                        status: "error",
                        message: "Невірний формат base64 зображення",
                    };
                }
                const [, ext, base64Data] = matches;
                const allowedFormats = ["jpeg", "png", "gif"];
                const maxSizeInBytes = 5 * 1024 * 1024;
                if (!allowedFormats.includes(ext.toLowerCase())) {
                    return {
                        status: "error",
                        message: `Непідтримуваний формат зображення: ${ext}`,
                    };
                }
                const buffer = Buffer.from(base64Data, "base64");
                if (buffer.length > maxSizeInBytes) {
                    return {
                        status: "error",
                        message: `Зображення занадто велике: максимум 5 MB`,
                    };
                }
                const filename = `${Date.now()}-${Math.round(Math.random() * 1000000)}.${ext}`;
                const filePath = path_1.default.join(uploadDir, filename);
                yield promises_1.default.writeFile(filePath, buffer);
                try {
                    yield promises_1.default.access(filePath);
                    updateData.image = `uploads/${filename}`;
                    createdImageFilename.push(filename);
                }
                catch (_a) {
                    return {
                        status: "error",
                        message: "Не вдалося зберегти зображення",
                    };
                }
            }
            const user = yield userRepository_1.default.updateUserById(updateData, id);
            if (!user) {
                for (const filename of createdImageFilename) {
                    yield promises_1.default.unlink(path_1.default.join(uploadDir, filename)).catch(() => { });
                }
                return { status: "error", message: "User doesn't update" };
            }
            if (user.image && !user.image.startsWith("http")) {
                const relativeUrl = user.image
                    .replace(/^uploads\/+/, "")
                    .replace(/\\/g, "/");
                user.image = `${__1.API_BASE_URL}/uploads/${relativeUrl}`;
            }
            console.log("beeeeeeeeeeeee");
            console.log(user);
            console.log("beeeeeeeeeeeee");
            return { status: "success", data: user };
        }
        catch (err) {
            for (const filename of createdImageFilename) {
                yield promises_1.default
                    .unlink(path_1.default.join(__dirname, "..", "..", "public", "uploads", filename))
                    .catch(() => { });
            }
            return { status: "error", message: "Internal server error" };
        }
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield userRepository_1.default.getUsers();
        if (!users) {
            return { status: "error", message: "No users found" };
        }
        return { status: "success", data: users };
    });
}
const userService = {
    login,
    registration,
    getUserById,
    sendEmail,
    verifyCode,
    saveCode,
    updateUserById,
    getUsers,
};
exports.default = userService;
