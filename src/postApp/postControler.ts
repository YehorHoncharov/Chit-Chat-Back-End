import { Request, Response } from 'express'
import postService from './postService'
import { IPost } from './types';


async function getPosts(req: Request, res: Response){
    const result = await postService.getPosts();
    if(result.status == 'error'){
        res.send('error')
    }
    else{
        res.json(result.data)
    }
    
}

async function createPost(req: Request, res: Response){
    const newPost = req.body
    const result = await postService.createPost(newPost)
    if(result.status == 'error'){
        res.send('error')
    }
    else{
        res.json(result.data)
    }
}

async function deletePost(req: Request, res: Response){
    let id = req.params.id
    const result = await postService.deletePost(+id)
    if(result.status == 'error'){
        res.send('error')
    }
    else{
        res.json(result.data)
    }
}

async function editPost(req: Request, res: Response){
    let body = req.body
    let id = req.params.id
    const result = await postService.editPost(body, +id)
    if(result.status == 'error'){
        res.send('error')
    }
    else{
        res.json(result.data)
    }
}

const postController = {
    createPost,
    deletePost,
    editPost,
    getPosts,
}

export default postController