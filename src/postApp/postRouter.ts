import express from 'express';
import postController from '../postApp/postControler'

const router = express.Router();

router.post('/create', postController.createPost)
router.delete('/:id', postController.deletePost)
router.put('/:id', postController.editPost)
router.get('/', postController.getPosts)

export default router