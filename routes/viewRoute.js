const express=require('express');
const viewController=require('../controller/viewController');
const authController=require('../controller/authController');

const viewRouter=express.Router();


viewRouter.get('/',viewController.getLandingPage);
viewRouter.get('/global',authController.protect,viewController.getGlobalPage);
viewRouter.get('/api/users/changePassword/:resetToken',viewController.getResetPasswordPage);
viewRouter.get('/account/:id',authController.protect,viewController.getAccountPage);

module.exports=viewRouter;