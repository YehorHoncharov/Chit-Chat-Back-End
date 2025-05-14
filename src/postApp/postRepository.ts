import prisma from "../client/prismaClient";
import { Prisma } from "../generated/prisma/client";
import { IUpdatePost, Post } from "./types";

async function getPosts(){
    try{
        let post = await prisma.userPost.findMany(
            {})
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

async function createPost(data: Post){
    try{
        let createPost = await prisma.userPost.create({
            data: data,
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
            where: { id }, data: Post
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
async function deletePost(id: number){
    try{
        let deletePost = await prisma.userPost.delete({
            where: { id }
        })
        return deletePost
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError){
            if (err.code == 'P2002'){
                console.log(err.message)
                throw err
            }
        }
    }
}

const postRepository = {
    getPosts,
    createPost, 
    editPost,
    deletePost

}
export {postRepository}