import { Prisma } from "@prisma/client";
import { IError, IOkWithData } from "../types/types";
import { postRepository } from "./postRepository";
import { Post, CreatePost, IUpdatePost, CreatePostData } from "./types";
import fs from "fs/promises";
import path from "path";

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
            if (data.images[0]?.startsWith('data:image')) {
                const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
                await fs.mkdir(uploadDir, { recursive: true });
                
                const imageUrls = await Promise.all(
                    data.images.map(async (base64) => {
                        const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
                        if (!matches) throw new Error('Invalid base64 image');
                        
                        const [_, ext, data] = matches;
                        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
                        const filePath = path.join(uploadDir, filename);
                        
                        await fs.writeFile(filePath, data, { encoding: 'base64' });
                        return `/uploads/${filename}`;
                    })
                );
                
                imagesInput = {
                    create: imageUrls.map(url => ({ url }))
                };
            } 
            else {
                imagesInput = {
                    create: data.images.map(url => ({ url }))
                };
            }
        }


        const postData: CreatePost = {
            name: data.name,
            text: data.text,
            authorId: data.authorId,
            theme: data.theme ?? null,
            tags: data.tags ?? null,
            links: data.links ?? null,
            views: data.views ?? null,
            likes: data.likes ?? null,
            images: imagesInput
        };

        const newPost = await postRepository.createPost(postData);

        if (!newPost) {
            return { status: 'error', message: "Post creation failed" };
        }

        return { status: 'success', data: newPost };
    } catch (err) {
        console.error('Error in createPost service:', err);
        
        return { 
            status: 'error', 
            message: err instanceof Error ? err.message : 'Database error' 
        };
    }
}

async function editPost(
  name: IUpdatePost,
  id: number
): Promise<IOkWithData<Post> | IError> {
  const editPost = await postRepository.editPost(name, id);

  if (!editPost) {
    return { status: "error", message: "Post desn't update!" };
  }

  return { status: "success", data: editPost };
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
