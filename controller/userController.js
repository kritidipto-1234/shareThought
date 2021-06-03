const User=require('../model/userModel');
const Post=require('../model/postModel');
const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');
const authController=require('./authController');

exports.editAccount=catchAsync(async(req,res,next)=>
{
    const user=await User.findOne({_id:req.user._id});
    if (!user) return next(new AppError(400,'User has been deleted'));

    if (!req.body.currentPassword) return next(new AppError(401,'Please give ur current password'));
    if (!(await user.isCorrectPassword(req.body.currentPassword))) return next(new AppError(401,'Wrong password'));
    
    if (req.body.newPassword)
    {
        user.password=req.body.newPassword;
        user.passwordConfirm=req.body.newPasswordConfirm;
    }
    if ( (req.body.newPassword && !req.body.newPasswordConfirm) ||  (!req.body.newPassword && req.body.newPasswordConfirm) ) return next(new AppError(400,'For changing password,both New Password and New Password Confirm required'));

    user.name=req.body.name || user.name;
    user.description=req.body.description || user.description;
    user.email=req.body.email || user.email;
    await user.save({validateModifiedOnly:true});

    const jwtToken=authController.generateAccessToken({id:user._id});
    res.cookie('jwt',jwtToken,
    {
        // httpOnly:true,
        expires:new Date(Date.now()+1000*process.env.JWT_COOKIE_EXPIRES_IN)
    });
    res.status(201).json({
        "status":"success",
        user,
        jwtToken
    });
});

exports.deleteAccount=catchAsync(async (req,res,next)=>
{
    if (!req.body.password) return next(new AppError(400,'Give password to delete account'));

    const user=await User.findOne({_id:req.user.id});
    if (!(await user.isCorrectPassword(req.body.password))) return next(new AppError(400,'Wrong Password'));
    await Post.deleteMany({postedBy:req.user._id});
    await User.findOneAndDelete({_id:req.user._id});

    res.cookie('jwt','random-invaid-jwt-token',
    {
        // httpOnly:true,
        expires:new Date(Date.now()+1000*process.env.JWT_COOKIE_EXPIRES_IN)
    });
    res.status(204).json({
        status:"success",
        message:"User deleted"
    });
});

exports.viewAccount=catchAsync(async(req,res,next)=>
{
    const user=await User.findOne({_id:req.params.id}).select('-_id -password -passwordChangedAt');
    const posts=await Post.find({postedBy:req.params.id}).populate('postedBy','name description');
    res.status(200).json({
        status:'success',
        user,
        posts
    });
});
