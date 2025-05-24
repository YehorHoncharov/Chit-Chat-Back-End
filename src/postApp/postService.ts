import { Prisma } from "@prisma/client";
import { IError, IOkWithData } from "../types/types";
import { postRepository } from "./postRepository";
import { Post, CreatePost, IUpdatePost, CreatePostData } from "./types";
import fs from "fs/promises";
import path from "path";
import prisma from "../client/prismaClient";

async function getPosts(): Promise<IOkWithData<Post[]> | IError> {
	const posts = await postRepository.getPosts();

	if (!posts) {
		return { status: "error", message: "No posts found" };
	}

	return { status: "success", data: posts };
}

async function createPost(
	data: CreatePost
): Promise<IOkWithData<Post> | IError> {
	try {
		let imagesInput: CreatePostData | undefined;

		if (data.images && Array.isArray(data.images)) {
			if (data.images[0]?.startsWith("data:image")) {
				const uploadDir = path.join(
					__dirname,
					"..",
					"..",
					"public",
					"uploads"
				);
				await fs.mkdir(uploadDir, { recursive: true });

				const imageUrls = await Promise.all(
					data.images.map(async (base64) => {
						const matches = base64.match(
							/^data:image\/(\w+);base64,(.+)$/
						);
						if (!matches) throw new Error("Invalid base64 image");

						const [_, ext, data] = matches;
						const filename = `${Date.now()}-${Math.round(
							Math.random() * 1e9
						)}.${ext}`;
						const filePath = path.join(uploadDir, filename);

						await fs.writeFile(filePath, data, {
							encoding: "base64",
						});
						return `uploads/${filename}`;
					})
				);

				imagesInput = {
					create: imageUrls.map((url) => ({ url })),
				};
			} else {
				imagesInput = {
					create: data.images.map((url) => ({ url })),
				};
			}
		}

		const postData: CreatePost = {
			name: data.name,
			text: data.text,
			authorId: data.authorId,
			theme: data.theme ?? null,
			tags: data.tags ?? undefined,
			links: data.links ?? null,
			views: data.views ?? null,
			likes: data.likes ?? null,
			images: imagesInput,
		};

		const newPost = await postRepository.createPost(postData);

		if (!newPost) {
			return { status: "error", message: "Post creation failed" };
		}

		return { status: "success", data: newPost };
	} catch (err) {
		console.error("Error in createPost service:", err);

		return {
			status: "error",
			message: err instanceof Error ? err.message : "Database error",
		};
	}
}

async function editPost(
	data: IUpdatePost,
	id: number
): Promise<IOkWithData<Post> | IError> {
	try {
		const API_BASE_URL = "http://192.168.1.104:3000";
		const uploadDir = path.join(__dirname, "..", "..", "public", "Uploads");
		await fs.mkdir(uploadDir, { recursive: true });

		// Отримуємо поточний пост
		const currentPost = await prisma.userPost.findUnique({
			where: { id },
			include: {
				images: true,
				tags: { include: { tag: true } },
			},
		});

		if (!currentPost) {
			return { status: "error", message: "Пост не знайдено" };
		}

		// Підготовка даних для оновлення
		const updateData: IUpdatePost = {
			name: data.name ?? currentPost.name,
			text: data.text ?? currentPost.text,
			theme: data.theme ?? currentPost.theme,
			links: data.links ?? currentPost.links,
			views: data.views ?? currentPost.views,
			likes: data.likes ?? currentPost.likes,
		};

		// Обробка зображень
		if (data.images) {
			if ("create" in data.images && Array.isArray(data.images.create)) {
				const createdImages = await Promise.all(
					data.images.create.map(async (image) => {
						if (
							typeof image === "object" &&
							"url" in image &&
							image.url
						) {
							if (image.url.startsWith("data:image")) {
								const matches = image.url.match(
									/^data:image\/(\w+);base64,(.+)$/
								);
								if (!matches)
									throw new Error(
										"Невірний формат зображення"
									);

								const [_, ext, base64Data] = matches;
								const filename = `${Date.now()}-${Math.random()
									.toString(36)
									.substr(2, 9)}.${ext}`;
								const filePath = path.join(uploadDir, filename);

								await fs.writeFile(filePath, base64Data, {
									encoding: "base64",
								});
								return { url: `uploads/${filename}` };
							}
							return { url: image.url };
						}
						throw new Error("Некоректні дані зображення");
					})
				);
				updateData.images = { create: createdImages };
			}

			if ("delete" in data.images) {
				const toDelete = Array.isArray(data.images.delete)
					? data.images.delete
					: [data.images.delete];
				const idsToDelete = toDelete
					.filter(
						(img): img is { id: number } =>
							typeof img === "object" && "id" in img
					)
					.map((img) => img.id);

				if (idsToDelete.length > 0) {
					updateData.images = {
						...updateData.images,
						delete: idsToDelete.map((id) => ({ id })),
					};
				}
			}
		}

		// Обробка тегів
		if (data.tags && Array.isArray(data.tags)) {
			console.log("Отримані теги:", data.tags);
			await prisma.userPostTags.deleteMany({ where: { userPostId: id } });

			const tagConnections = await Promise.all(
				data.tags
					.filter(
						(tagName) =>
							typeof tagName === "string" && tagName.trim() !== ""
					)
					.map(async (tagName) => {
						let tag = await prisma.tags.findFirst({
							where: { name: tagName },
						});
						if (!tag) {
							tag = await prisma.tags.create({
								data: { name: tagName },
							});
							console.log("Створено новий тег:", tag);
						}
						return { tagId: tag.id };
					})
			);

			updateData.tags = {
				create: tagConnections.map((connection) => ({
					tag: { connect: { id: connection.tagId } },
				})),
			};
		}

		// Оновлюємо пост
		const updatedPost = await prisma.userPost.update({
			where: { id },
			data: updateData,
			include: {
				images: true,
				tags: {
					include: { tag: true },
				},
			},
		});

		console.log("Оновлений пост:", JSON.stringify(updatedPost, null, 2));

		// Нормалізація URL для фронтенда
		const normalizedPost = {
			...updatedPost,
			images: updatedPost.images.map((img) => ({
				...img,
				url: img.url.startsWith("http")
					? img.url
					: `${API_BASE_URL}/${img.url
							.replace(/\\/g, "/")
							.replace(/^\/+/, "")}`,
			})),
		};

		return { status: "success", data: normalizedPost };
	} catch (err) {
		console.error("Помилка при оновленні поста:", err);
		return {
			status: "error",
			message: err instanceof Error ? err.message : "Помилка бази даних",
		};
	}
}

async function deletePost(id: number): Promise<IOkWithData<Post> | IError> {
	try {
		const deletedPost = await postRepository.deletePost(id);

		const result: Post = {
			...deletedPost,
			tags: deletedPost.tags.map((t) => ({
				userPostId: t.userPostId,
				tagId: t.tagId,
				tag: t.tag,
			})),
			images: deletedPost.images.map((img) => ({
				id: img.id,
				userPostId: img.userPostId,
				url: img.url,
			})),
		};

		return { status: "success", data: result };
	} catch (error) {
		console.error("Error in deletePost service:", error);
		return {
			status: "error",
			message:
				error instanceof Error
					? error.message
					: "Failed to delete post",
		};
	}
}

const postService = {
	createPost,
	deletePost,
	editPost,
	getPosts,
};

export default postService;
