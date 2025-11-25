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
exports.editAlbum = editAlbum;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const albumRepository_1 = require("./albumRepository");
const __1 = require("..");
function getAlbums() {
    return __awaiter(this, void 0, void 0, function* () {
        const albums = yield albumRepository_1.albumRepository.getAlbums();
        if (!albums) {
            return { status: "error", message: "No albums found" };
        }
        return { status: "success", data: albums };
    });
}
function createAlbum(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let topicInput;
        if (Array.isArray(data.topic)) {
            if (data.topic.length > 10) {
                return { status: "error", message: "Максимум 10 тегів дозволено" };
            }
            for (const tag of data.topic) {
                if (typeof tag !== "string" || tag.length > 50) {
                    return { status: "error", message: "Кожен тег має бути рядком не довшим за 50 символів" };
                }
            }
            const tagConnections = yield Promise.all(data.topic.map((topicName) => __awaiter(this, void 0, void 0, function* () {
                let tag = yield prismaClient_1.default.tags.findFirst({ where: { name: topicName } });
                if (!tag) {
                    tag = yield prismaClient_1.default.tags.create({ data: { name: topicName } });
                }
                return { tag: { connect: { id: tag.id, name: tag.name } } };
            })));
            topicInput = {
                create: tagConnections,
            };
        }
        const albumData = {
            name: data.name,
            topic: topicInput,
            author_id: data.author_id,
            images: data.images
        };
        const result = yield albumRepository_1.albumRepository.createAlbum(albumData);
        console.log(result);
        if (!result) {
            return { status: "error", message: "album not created" };
        }
        return { status: "success", data: result };
    });
}
function editAlbum(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const createdImageUrls = [];
        try {
            console.log(data.images);
            const uploadDir = path_1.default.join(__dirname, "..", "..", "public", "uploads");
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
            const currentAlbum = yield prismaClient_1.default.album.findUnique({
                where: { id },
                include: {
                    images: {
                        select: {
                            image: true
                        }
                    },
                    topic: {
                        select: {
                            tag: true
                        }
                    },
                }
            });
            const updateData = {
                name: typeof data.name === "string" ? (_a = data.name) === null || _a === void 0 ? void 0 : _a.trim() : (_b = data.name) !== null && _b !== void 0 ? _b : currentAlbum === null || currentAlbum === void 0 ? void 0 : currentAlbum.name,
            };
            // Обробка тегів
            if (data.tags && Array.isArray(data.tags)) {
                const validTags = data.tags
                    .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
                    .filter((tag) => tag.length <= 50);
                if (validTags.length !== data.tags.length) {
                    console.error("[EditAlbum] Некоректні теги:", data.tags);
                    return { status: "error", message: "Некоректний тег або занадто довгий (макс. 50 символів)" };
                }
                const currentTags = yield prismaClient_1.default.post_app_album_tags.findMany({
                    where: { album_id: id },
                    include: { tag: true }
                });
                if (validTags.length > 0) {
                    yield prismaClient_1.default.post_app_album_tags.deleteMany({
                        where: { album_id: id }
                    });
                    const lastTag = validTags[validTags.length - 1];
                    let tag = yield prismaClient_1.default.tags.findFirst({ where: { name: lastTag } });
                    if (!tag) {
                        tag = yield prismaClient_1.default.tags.create({ data: { name: lastTag } });
                    }
                    updateData.topic = {
                        create: {
                            tag: { connect: { id: tag.id } }
                        }
                    };
                }
            }
            // Обробка зображень
            if (data.images) {
                const allowedFormats = ["jpeg", "png", "gif"];
                const maxSizeInBytes = 5 * 1024 * 1024; // 5 МБ
                const currentImages = currentAlbum === null || currentAlbum === void 0 ? void 0 : currentAlbum.images;
                console.log(currentImages);
                const imagesToDelete = currentImages === null || currentImages === void 0 ? void 0 : currentImages.filter(currentImg => {
                    if (data.images)
                        return data.images.some(newImg => newImg.image.id === currentImg.image.id);
                });
                if (imagesToDelete) {
                    if (imagesToDelete.length > 0) {
                        yield prismaClient_1.default.post_app_album_images.deleteMany({
                            where: {
                                album_id: id,
                                image_id: { in: imagesToDelete.map(img => img.image.id) }
                            }
                        });
                        yield prismaClient_1.default.image.deleteMany({
                            where: {
                                id: { in: imagesToDelete.map(img => img.image.id) }
                            }
                        });
                    }
                }
                const createImages = [];
                for (const image of data.images) {
                    try {
                        if (!image.image.filename) {
                            continue;
                        }
                        if (image.image.filename.startsWith("data:image")) {
                            const matches = image.image.filename.match(/^data:image\/(\w+);base64,(.+)$/);
                            if (!matches) {
                                console.error("[EditPost] Невірний формат base64");
                                continue;
                            }
                            const [, ext, base64Data] = matches;
                            if (!allowedFormats.includes(ext.toLowerCase())) {
                                console.error("[EditPost] Непідтримуваний формат зображення:", ext);
                                continue;
                            }
                            const buffer = Buffer.from(base64Data, "base64");
                            if (buffer.length > maxSizeInBytes) {
                                console.error("[EditPost] Зображення занадто велике:", buffer.length);
                                continue;
                            }
                            const filename = `${Date.now()}-${Math.round(Math.random() * 1000000)}.${ext}`;
                            const filePath = path_1.default.join(uploadDir, filename);
                            yield promises_1.default.writeFile(filePath, buffer);
                            console.log("[EditPost] Зображення збережено:", filePath);
                            yield promises_1.default.access(filePath);
                            createdImageUrls.push(filename);
                            createImages.push({ url: `uploads/${filename}` });
                        }
                        else {
                            console.log(222);
                            createImages.push({ url: image.image.filename });
                        }
                    }
                    catch (error) {
                        console.error("[EditPost] Помилка обробки зображення:", error);
                        continue;
                    }
                }
                updateData.images = {
                    create: createImages.map(img => ({
                        image: {
                            create: {
                                filename: img.url,
                                file: img.url
                            }
                        }
                    }))
                };
            }
            // Оновлення поста
            console.log("[EditPost] Дані для оновлення:", JSON.stringify(updateData, null, 2));
            const updatedAlbum = yield prismaClient_1.default.album.update({
                where: { id },
                data: updateData,
                include: {
                    images: { include: { image: true } },
                    topic: { include: { tag: true } },
                },
            });
            // Нормалізація URL зображень
            const normalizedAlbum = Object.assign(Object.assign({}, updatedAlbum), { images: updatedAlbum.images.map((img) => {
                    const relativeUrl = img.image.filename.replace(/\\/g, "/").replace(/^uploads\/+/, "");
                    const fullUrl = img.image.filename.startsWith("http") ? img.image.filename : `${__1.API_BASE_URL}/uploads/${relativeUrl}`;
                    console.log(`[EditPost] Нормалізований URL зображення: ${fullUrl}`);
                    return Object.assign(Object.assign({}, img), { url: fullUrl });
                }) });
            // Перевірка доступності файлів
            for (const img of normalizedAlbum.images) {
                if (!img.url.startsWith("http")) {
                    const filePath = path_1.default.join(uploadDir, img.url.replace(/^uploads\//, ""));
                    try {
                        yield promises_1.default.access(filePath);
                        console.log(`[EditPost] Файл зображення доступний: ${filePath}`);
                    }
                    catch (_c) {
                        console.error(`[EditPost] Файл зображення не знайдено: ${filePath}`);
                        throw new Error(`Зображення не знайдено: ${img.url}`);
                    }
                }
            }
            console.log("Пост оновлено, зображення:", normalizedAlbum.images);
            return { status: "success", data: normalizedAlbum };
        }
        catch (err) {
            console.error("Помилка:", err);
            // Очищення створених файлів
            for (const filename of createdImageUrls) {
                const filePath = path_1.default.join(__dirname, "..", "..", "public", "uploads", filename);
                console.log(`[EditPost] Видаляємо файл: ${filePath}`);
                yield promises_1.default.unlink(filePath).catch((e) => console.error("[EditPost] Помилка видалення файлу:", e));
            }
            return {
                status: "error",
                message: err instanceof Error ? err.message : "Не вдалося оновити пост",
            };
        }
    });
}
function deleteAlbum(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteAlbum = yield albumRepository_1.albumRepository.deleteAlbum(id);
            return { status: "success", data: deleteAlbum };
        }
        catch (error) {
            console.error("Error in deleteAlbum service:", error);
            return {
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to delete album",
            };
        }
    });
}
const albumService = {
    createAlbum,
    deleteAlbum,
    editAlbum,
    getAlbums,
};
exports.default = albumService;
