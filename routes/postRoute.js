const express=require('express');
const postController=require('../controller/postController');
const authController=require('../controller/authController');

const postRouter=express.Router();

postRouter.post('/createPost',authController.protect,postController.createPost);
postRouter.get('/getAllPosts',authController.protect,postController.getAllPosts);
postRouter.delete('/deletePost/:id',authController.protect,postController.deletePost);


module.exports=postRouter;