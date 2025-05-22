import { Prisma } from "../generated/prisma";

export type Post = Prisma.UserPostGetPayload<{
    include: {
        images: true,
        tags: true
    }
}>;

export type CreatePost = Prisma.UserPostUncheckedCreateInput;

export type IUpdatePost = Prisma.UserPostUpdateInput;

export type CreatePostData = Prisma.ImageUncheckedCreateNestedManyWithoutPostInput;
