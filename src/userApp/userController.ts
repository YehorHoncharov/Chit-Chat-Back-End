import { Request, Response } from 'express'
import userService from './userService'

async function registerUser(req: Request, res: Response){
    const data = req.body
    const result = await userService.registration(data)
    res.json(result)
}

async function loginUser(req: Request, res: Response){
    const data = req.body
    const result = await userService.login(data.email, data.password)
    if (result.status === 'success'){
        const resultEmail = await userService.sendEmail(data.email);
    }
    res.json(result)
}

async function getUserById(req: Request, res: Response){
    let id = req.params.id
    const result = await userService.getUserById(+id);
    res.json(result)
}

async function checkCode(req: Request, res: Response){
    let body = req.body
    const result = await userService.verifyCode(body.email, body.code)
    res.json(result)
}

const userController = {
    registerUser,
    loginUser,
    getUserById,
    checkCode

}

export default userController