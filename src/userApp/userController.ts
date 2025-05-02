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
    res.json(result)
}

async function getUserById(req: Request, res: Response){
    let id = req.params.id
    const result = await userService.getUserById(+id);
    res.json(result)
}

const userController = {
    registerUser,
    loginUser,
    getUserById

}

export default userController