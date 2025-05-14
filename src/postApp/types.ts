import { Prisma } from "../generated/prisma";

export type Post = Prisma.UserPostGetPayload<{}>

export type CreatePost = Prisma.UserPostCreateInput

export type IUpdatePost = Prisma.UserPostUpdateInput

export interface IPost {
    id: number,
    name: string,
    theme: string,
    tags: string,
    text: string,
    links: string,
    image: string,
    views: number,
    likes: number,
    authorId: number
}
