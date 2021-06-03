const express=require('express');
const userController=require('../controller/userController');
const authController=require('../controller/authController');

const userRouter=express.Router();


userRouter.post('/createUser',authController.createUser);
userRouter.post('/login',authController.login);
userRouter.get('/viewAccount/:id',authController.protect,userController.viewAccount);
userRouter.patch('/editAccount',authController.protect,userController.editAccount);
userRouter.delete('/deleteAccount',authController.protect,userController.deleteAccount);
userRouter.get('/logout',authController.protect,authController.logout);
userRouter.post('/forgotPassword',authController.forgotPassword);
userRouter.patch('/resetPassword/:resetToken',authController.resetPassword);

module.exports=userRouter;