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
  console.log("Edit post data:", data);

  try {
    const uploadDir = path.join(__dirname, "..", "..", "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    let imageUrls: string[] = [];

    if (data.images?.create && Array.isArray(data.images.create)) {
      imageUrls = await Promise.all(
        data.images.create.map(async (image) => {
          const url = image.url;
          if (url.startsWith("data:image")) {
            const matches = url.match(/^data:image\/(\w+);base64,(.+)$/);
            if (!matches) throw new Error("Invalid base64 image");

            const [_, ext, base64Data] = matches;
            const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
            const filePath = path.join(uploadDir, filename);
            await fs.writeFile(filePath, base64Data, { encoding: "base64" });
            return `uploads/${filename}`;
          }
          return url;
        })
      );
    }

    // Update post (без tags)
    const updatedPost = await prisma.userPost.update({
      where: { id },
      data: {
        name: data.name,
        text: data.text,
        theme: data.theme ?? null,
        links: data.links ?? null,
        views: data.views ?? null,
        likes: data.likes ?? null,
        images: {
          deleteMany: {}, // видаляємо старі
          create: imageUrls.map((url) => ({ url })),
        },
      },
    });

    // Обробка tags
    if (Array.isArray(data.tags)) {
      // Видалити старі теги
      await prisma.userPostTags.deleteMany({
        where: { userPostId: id },
      });

      for (const tagName of data.tags) {
        let tag = await prisma.tags.findFirst({ where: { name: tagName } });
        if (!tag) {
          tag = await prisma.tags.create({ data: { name: tagName } });
        }

        await prisma.userPostTags.create({
          data: {
            userPostId: id,
            tagId: tag.id,
          },
        });
      }
    }

    // Повернути оновлений пост з усіма залежностями
    const fullPost = await prisma.userPost.findUnique({
      where: { id },
      include: {
        images: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return fullPost
      ? { status: "success", data: fullPost }
      : { status: "error", message: "Post not found after update" };
  } catch (err) {
    console.error("Error in editPost service:", err);
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Database error",
    };
  }
}



async function deletePost(id: number): Promise<IOkWithData<Post> | IError> {
	const deletePost = await postRepository.deletePost(id);

	if (!deletePost) {
		return { status: "error", message: "Cannot delete post" };
	}

	return { status: "success", data: deletePost };
}

const postService = {
	createPost,
	deletePost,
	editPost,
	getPosts,
};

export default postService;
