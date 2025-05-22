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

async function createPost(data: CreatePost): Promise<IOkWithData<Post> | IError> {
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

async function editPost(data: IUpdatePost, id: number): Promise<IOkWithData<Post> | IError> {
  console.log("Дані для оновлення поста:", data);

  try {
    const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const API_BASE_URL = "http://192.168.1.104:3000";
    let imageUrls: string[] = [];

    const currentPost = await prisma.userPost.findUnique({
      where: { id },
      include: { 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });

    if (!currentPost) {
      return { status: "error", message: "Пост не знайдено" };
    }

    // Обробка зображень
    if (data.images && 'create' in data.images && Array.isArray(data.images.create)) {
      imageUrls = await Promise.all(
        data.images.create.map(async (image) => {
          if ('url' in image) {
            const url = image.url;
            if (url.startsWith("data:image")) {
              const matches = url.match(/^data:image\/(\w+);base64,(.+)$/);
              if (!matches) throw new Error("Невірний base64 формат зображення");

              const [_, ext, base64Data] = matches;
              const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
              const filePath = path.join(uploadDir, filename);
              console.log('Збереження зображення в:', filePath); // Логування
              await fs.writeFile(filePath, base64Data, { encoding: "base64" });
              console.log('Зображення збережено:', filename); // Логування
              return `uploads/${filename}`;
            }
            return url;
          }
          return '';
        })
      );
      console.log('Створені URL зображень:', imageUrls); // Логування
    }

    // // Видалення старих зображень
    // if (data.images && 'delete' in data.images && Array.isArray(data.images.delete)) {
    //   const imageIdsToDelete = data.images.delete
    //     .map(img => 'id' in img ? img.id : undefined)
    //     .filter((id): id is number => id !== undefined);
      
    //   if (imageIdsToDelete.length > 0) {
    //     await prisma.image.deleteMany({
    //       where: { id: { in: imageIdsToDelete } }
    //     });
    //     console.log('Видалені зображення з ID:', imageIdsToDelete); // Логування
    //   }
    // }

    // Оновлюємо пост
    const updateData: IUpdatePost = {
      name: data.name ?? currentPost.name,
      text: data.text ?? currentPost.text,
      theme: data.theme ?? currentPost.theme,
      links: data.links ?? currentPost.links,
      views: data.views ?? currentPost.views,
      likes: data.likes ?? currentPost.likes,
    };

    if (imageUrls.length > 0) {
      updateData.images = { 
        create: imageUrls.map(url => ({ url })) 
      };
    }
    console.log('Дані для оновлення поста:', updateData); // Логування

    await prisma.userPost.update({
      where: { id },
      data: updateData,
    });

    // Обробка тегів
    if (data.tags && Array.isArray(data.tags)) {
      await prisma.userPostTags.deleteMany({ where: { userPostId: id } });

      for (const tagName of data.tags) {
        const existingTag = await prisma.tags.findFirst({ 
          where: { name: { equals: tagName } }
        });

        if (existingTag) {
          await prisma.userPostTags.create({
            data: { 
              userPostId: id, 
              tagId: existingTag.id 
            },
          });
        } else {
          const newTag = await prisma.tags.create({ 
            data: { name: tagName } 
          });
          await prisma.userPostTags.create({
            data: { 
              userPostId: id, 
              tagId: newTag.id 
            },
          });
        }
      }
    }

    // Отримуємо оновлений пост
    const fullPost = await prisma.userPost.findUnique({
      where: { id },
      include: { 
        images: true, 
        tags: { include: { tag: true } } 
      },
    });

    if (!fullPost) {
      return { status: "error", message: "Не вдалося отримати оновлений пост" };
    }

    // Нормалізуємо URL зображень
    const normalizedPost = {
      ...fullPost,
      images: fullPost.images.map(img => ({
        ...img,
        url: img.url.startsWith('https') ? img.url : `${API_BASE_URL}/${img.url.replace(/^\/+/, '')}`,
      })),
      tags: fullPost.tags,
    };
    console.log('Повернуті URL зображень:', normalizedPost.images.map(img => img.url)); // Логування

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
            tags: deletedPost.tags.map(t => ({
                userPostId: t.userPostId,
                tagId: t.tagId,
                tag: t.tag
            })),
            images: deletedPost.images.map(img => ({
                id: img.id,
                userPostId: img.userPostId,
                url: img.url
            }))
        };

        return { status: "success", data: result };
    } catch (error) {
        console.error("Error in deletePost service:", error);
        return {
            status: "error",
            message: error instanceof Error ? error.message : "Failed to delete post"
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
