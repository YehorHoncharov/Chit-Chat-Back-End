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
exports.saveBase64Image = saveBase64Image;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const UPLOAD_DIR = path_1.default.join(__dirname, "../public/uploads/");
function saveBase64Image(base64) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            console.error("Invalid base64 format:", base64.substring(0, 50) + "...");
            throw new Error("Invalid base64 image format");
        }
        const [_, ext, data] = matches;
        const filename = `${(0, uuid_1.v4)()}.${ext}`;
        const filePath = path_1.default.join(UPLOAD_DIR, filename);
        yield promises_1.default.mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`Directory ${UPLOAD_DIR} exists:`, yield promises_1.default
            .access(UPLOAD_DIR)
            .then(() => true)
            .catch(() => false));
        try {
            yield promises_1.default.writeFile(filePath, data, { encoding: "base64" });
            console.log(`File saved: ${filePath}`);
            return `uploads/${filename}`;
        }
        catch (err) {
            console.error("Error saving file:", err);
            throw new Error("Failed to save image");
        }
    });
}
