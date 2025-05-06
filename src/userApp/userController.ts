import { Request, Response } from 'express'
import userService from './userService'

async function sendCode(req: Request, res: Response){
    const data = req.body
    const resultEmail = await userService.sendEmail(data.email);
    res.json(resultEmail)
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

async function registerUser(req: Request, res: Response){
    let {code, ...user} = req.body
    userService.saveCode(user.email, code)
    const result = await userService.verifyCode(user.email, code)

    if (result.success === false){
        console.log(result)
        res.json(result)
        return
    }
    const resultUser = await userService.registration(user)
    
    res.json(resultUser)
}

const userController = {
    registerUser,
    loginUser,
    getUserById,
    sendCode

}

export default userController