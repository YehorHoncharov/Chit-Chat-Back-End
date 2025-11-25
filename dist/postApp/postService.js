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
const postRepository_1 = require("./postRepository");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prismaClient_1 = __importDefault(require("../client/prismaClient"));
const __1 = require("..");
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield postRepository_1.postRepository.getPosts();
        if (!posts) {
            return { status: "error", message: "No posts found" };
        }
        return { status: "success", data: posts };
    });
}
function createPost(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Валідація тегів
            console.log(data.theme, "theme");
            let tagsInput;
            if (Array.isArray(data.tags)) {
                if (data.tags.length > 10) {
                    return { status: "error", message: "Максимум 10 тегів дозволено" };
                }
                for (const tag of data.tags) {
                    if (typeof tag !== "string" || tag.length > 50) {
                        return { status: "error", message: "Кожен тег має бути рядком не довшим за 50 символів" };
                    }
                }
                const tagConnections = yield Promise.all(data.tags.map((tagName) => __awaiter(this, void 0, void 0, function* () {
                    let tag = yield prismaClient_1.default.tags.findFirst({ where: { name: tagName } });
                    if (!tag) {
                        tag = yield prismaClient_1.default.tags.create({ data: { name: tagName } });
                    }
                    return { tag: { connect: { id: tag.id, name: tag.name } } };
                })));
                tagsInput = {
                    create: tagConnections,
                };
            }
            let imageInput;
            if (Array.isArray(data.images)) {
                if (data.images.length > 10) {
                    return { status: "error", message: "Максимум 10 зображень дозволено" };
                }
                const imageConnections = yield Promise.all(data.images.map((mapImage) => __awaiter(this, void 0, void 0, function* () {
                    let image = yield prismaClient_1.default.image.findFirst({ where: { file: mapImage.url } });
                    if (!image) {
                        image = yield prismaClient_1.default.image.create({ data: { file: mapImage.url, filename: mapImage.url } });
                    }
                    return { image: { connect: { id: image.id, filename: image.filename, file: image.file } } };
                })));
                imageInput = {
                    create: imageConnections,
                };
            }
            // Формування даних поста
            const postData = {
                title: data.title,
                author_id: data.author_id,
                tags: tagsInput,
                content: data.content,
                theme: data.theme,
                images: imageInput,
            };
            console.log("Post data to be created:", JSON.stringify(postData, null, 2));
            // Створення поста
            const newPost = yield prismaClient_1.default.post.create({
                data: postData,
                include: {
                    images: { select: { image: true } },
                    tags: { include: { tag: true } },
                },
            });
            return { status: "success", data: newPost };
        }
        catch (err) {
            console.error("Помилка в createPost:", err);
            return {
                status: "error",
                message: err instanceof Error ? err.message : "Не вдалося створити пост",
            };
        }
    });
}
function editPost(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const createdImageUrls = [];
        try {
            const uploadDir = path_1.default.join(__dirname, "..", "..", "public", "uploads");
            console.log("[EditPost] Вхідні дані:", JSON.stringify(data, null, 2));
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
            console.log(`[EditPost] Директорія ${uploadDir} створена/існує`);
            const currentPost = yield prismaClient_1.default.post.findUnique({
                where: { id },
                include: {
                    images: {
                        select: {
                            image: true
                        }
                    },
                    tags: {
                        select: {
                            tag: true
                        }
                    },
                    likes: true,
                    views: true,
                }
            });
            if (!currentPost) {
                console.error("[EditPost] Пост із ID", id, "не знайдено");
                return { status: "error", message: "Пост не знайдено" };
            }
            const updateData = {
                title: typeof data.title === "string" ? data.title.trim() : (_a = data.title) !== null && _a !== void 0 ? _a : currentPost.title,
                content: typeof data.content === "string" ? data.content.trim() : (_b = data.content) !== null && _b !== void 0 ? _b : currentPost.content,
                theme: typeof data.theme === "string" ? data.theme.trim() : (_c = data.theme) !== null && _c !== void 0 ? _c : currentPost.theme,
            };
            // Обробка тегів
            if (data.tags && Array.isArray(data.tags)) {
                if (data.tags.length > 10) {
                    console.error("[EditPost] Занадто багато тегів:", data.tags.length);
                    return { status: "error", message: "Максимум 10 тегів дозволено" };
                }
                const validTags = data.tags
                    .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
                    .filter((tag) => tag.length <= 50);
                if (validTags.length !== data.tags.length) {
                    console.error("[EditPost] Некоректні теги:", data.tags);
                    return { status: "error", message: "Некоректні теги або занадто довгі (макс. 50 символів)" };
                }
                const currentTagNames = currentPost.tags.map(t => t.tag.name);
                const tagsToRemove = currentTagNames.filter(tag => !validTags.includes(tag));
                const tagsToAdd = validTags.filter(tag => !currentTagNames.includes(tag));
                yield prismaClient_1.default.post_app_post_tag.deleteMany({
                    where: {
                        post_id: id,
                        tag: {
                            name: { in: tagsToRemove }
                        }
                    }
                });
                // Додаємо нові теги
                if (tagsToAdd.length > 0) {
                    const tagConnections = yield Promise.all(tagsToAdd.map((tagName) => __awaiter(this, void 0, void 0, function* () {
                        let tag = yield prismaClient_1.default.tags.findFirst({ where: { name: tagName } });
                        if (!tag) {
                            tag = yield prismaClient_1.default.tags.create({ data: { name: tagName } });
                        }
                        return { tag: { connect: { id: tag.id } } };
                    })));
                    updateData.tags = {
                        create: tagConnections,
                    };
                }
            }
            // Обробка зображень
            if (data.images) {
                console.log("[EditPost] Обробка зображень:", JSON.stringify(data.images, null, 2));
                const allowedFormats = ["jpeg", "png", "gif"];
                const maxSizeInBytes = 5 * 1024 * 1024; // 5 МБ
                const currentImages = currentPost.images;
                const imagesToDelete = currentImages.filter(currentImg => {
                    if (data.images)
                        return data.images.some(newImg => newImg.id === currentImg.image.id);
                });
                if (imagesToDelete.length > 0) {
                    yield prismaClient_1.default.post_app_post_image.deleteMany({
                        where: {
                            post_id: id,
                            image_id: { in: imagesToDelete.map(img => img.image.id) }
                        }
                    });
                    yield prismaClient_1.default.image.deleteMany({
                        where: {
                            id: { in: imagesToDelete.map(img => img.image.id) }
                        }
                    });
                }
                const newImages = data.images.filter(img => !img.id);
                const createImages = [];
                for (const image of newImages) {
                    try {
                        if (typeof image !== "object" || !image.url) {
                            console.error("[EditPost] Некоректні дані зображення");
                            continue;
                        }
                        if (image.url.startsWith("data:image")) {
                            const matches = image.url.match(/^data:image\/(\w+);base64,(.+)$/);
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
                            createImages.push({ url: image.url });
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
            const updatedPost = yield prismaClient_1.default.post.update({
                where: { id },
                data: updateData,
                include: {
                    images: { include: { image: true } },
                    tags: { include: { tag: true } },
                },
            });
            // Нормалізація URL зображень
            const normalizedPost = Object.assign(Object.assign({}, updatedPost), { images: updatedPost.images.map((img) => {
                    const relativeUrl = img.image.filename.replace(/\\/g, "/").replace(/^uploads\/+/, "");
                    const fullUrl = img.image.filename.startsWith("http") ? img.image.filename : `${__1.API_BASE_URL}/uploads/${relativeUrl}`;
                    console.log(`[EditPost] Нормалізований URL зображення: ${fullUrl}`);
                    return Object.assign(Object.assign({}, img), { url: fullUrl });
                }) });
            // Перевірка доступності файлів
            for (const img of normalizedPost.images) {
                if (!img.url.startsWith("http")) {
                    const filePath = path_1.default.join(uploadDir, img.url.replace(/^uploads\//, ""));
                    try {
                        yield promises_1.default.access(filePath);
                        console.log(`[EditPost] Файл зображення доступний: ${filePath}`);
                    }
                    catch (_d) {
                        console.error(`[EditPost] Файл зображення не знайдено: ${filePath}`);
                        throw new Error(`Зображення не знайдено: ${img.url}`);
                    }
                }
            }
            console.log("Пост оновлено, зображення:", normalizedPost.images);
            return { status: "success", data: normalizedPost };
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
function deletePost(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedPost = yield postRepository_1.postRepository.deletePost(id);
            return { status: "success", data: deletedPost };
        }
        catch (error) {
            console.error("Error in deletePost service:", error);
            return {
                status: "error",
                message: error instanceof Error
                    ? error.message
                    : "Failed to delete post",
            };
        }
    });
}
const postService = {
    createPost,
    deletePost,
    editPost,
    getPosts,
};
exports.default = postService;
