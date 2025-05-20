import prisma from "../client/prismaClient";
import { Prisma } from "../generated/prisma/client";
import { CreatePost, IUpdatePost } from "./types";

async function getPosts(){
    try{
        let post = await prisma.userPost.findMany(
            {include: {
                images: true
            }})
        return post
    } catch(err){
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code == 'P2002'){
                console.log(err.message);
                throw err;
            }
            if (err.code == 'P2015'){
                console.log(err.message);
                throw err;
            }
            if (err.code == 'P20019'){
                console.log(err.message);
                throw err;
            }
        }
    }
}

async function createPost(data: CreatePost){
    try{
        let createPost = await prisma.userPost.create({
            data: data,
            include: 
            {
                images: true
            }
        })
        return createPost
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code == 'P2002'){
                console.log(err.message)
                throw err
            }
        }
    }
}

async function editPost(Post: IUpdatePost, id: number){
    try{
        let updatePost = await prisma.userPost.update({
            where: { id }, data: Post, include: {
                images: true
            }
        })
        return updatePost
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code == 'P2002'){
                console.log(err.message)
                throw err
            }
        }
    }
}
async function deletePost(id: number) {
    try {
        await prisma.image.deleteMany({
            where: { userPostId: id }
        });
        
        const deletedPost = await prisma.userPost.delete({
            where: { id },
            include: {
                images: true
            }
        });
        
        return deletedPost;
    } catch (err) {
        console.log(err);
        throw err; 
    }
}

const postRepository = {
    getPosts,
    createPost, 
    editPost,
    deletePost

}
export {postRepository}