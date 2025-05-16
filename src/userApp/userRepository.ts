import client from "../client/prismaClient";
import { IErrors, errors } from "../config/errorCodes"
import { Prisma } from "../generated/prisma";
import { IError } from "../types/types"
import { User, CreateUser } from "./types"

async function findUserByEmail(email: string){
    try {
        let user = await client.user.findUnique({
            where: {
                email: email
            }
        })
        return user;
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code in Object.keys(errors)){
                const errorKey: keyof IErrors = error.code
                console.log(errors[errorKey])
            }
        }
    }
}
async function createUser(data: CreateUser){
    try{
        const user = await client.user.create({
            data: data
        })
        return user;
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code in Object.keys(errors)){
                const errorKey: keyof IErrors = error.code
                console.log(errors[errorKey])
            }
        }
    }}


async function getUserById(id: number){
    try {
        let user = await client.user.findUnique({
            where: {
                id: id
            },
            select:{
                id: true,
                email: true,
                // username: true,
                // name: true,
                image: true,
                // about: true?
            }
        })
        return user;
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code in Object.keys(errors)){
                const errorKey: keyof IErrors = error.code
                console.log(errors[errorKey])
            }
        }
    }
}
const userRepository = {
    findUserByEmail: findUserByEmail,
    createUser: createUser,
    getUserById: getUserById
}

export default userRepository;