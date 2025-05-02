import { Prisma } from "../generated/prisma";

export type User = Prisma.UserGetPayload<{
    select:{
    id: true,
    email: true,
    username: true,
    name: true,
    image: true,
    about: true
}}>

export type CreateUser = Prisma.UserUncheckedCreateInput
