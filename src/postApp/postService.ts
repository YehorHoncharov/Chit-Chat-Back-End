import { IError, IOkWithData } from "../types/types";
import {postRepository} from "./postRepository";
import { Post, CreatePost, IUpdatePost } from "./types";


async function getPosts() : Promise<IOkWithData<Post[]> | IError >{
    const posts = await postRepository.getPosts()

    if (!posts) {
        return { status: 'error', message: 'No posts found' }
    }

    return { status: 'success', data: posts }
}

async function createPost(data: CreatePost): Promise<IOkWithData<Post> | IError>{
    const fixedData = {
        ...data,
        tags: data.tags === undefined ? null : data.tags,
        links: data.links === undefined ? null : data.links,
        images: data.images ? data.images  : undefined,
        views: data.views === undefined ? null : data.views,
        likes: data.likes === undefined ? null : data.likes,
    };

    const newPost = await postRepository.createPost(fixedData);

    if (!newPost) {
        return { status: 'error', message: "Post doesn't create!" }
    }

    return { status: 'success', data: newPost }
}


async function editPost(name: IUpdatePost, id: number): Promise<IOkWithData<Post> | IError>{
    const editPost = await postRepository.editPost(name, id)

    if (!editPost) {
        return { status: 'error', message: "Post desn't update!" }
    }

    return { status: 'success', data: editPost }
}


async function deletePost(id: number): Promise<IOkWithData<Post> | IError>{
    const deletePost = await postRepository.deletePost(id)

    if (!deletePost) {
        return { status: 'error', message: 'Cannot delete post' };
    }
    
    return { status: 'success', data: deletePost }
}

const postService = {
    createPost,
    deletePost,
    editPost,
    getPosts
};

export default postService;