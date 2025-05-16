import { Prisma } from "../generated/prisma";

export type Post = Prisma.UserPostGetPayload<{
    include: {
        images: true
    }}>

export type CreatePost = Prisma.UserPostUncheckedCreateInput

export type IUpdatePost = Prisma.UserPostUpdateInput


