const catchAsync=require('../utils/catchAsync');
const jwt=require('jsonwebtoken');
const User=require('../model/userModel');
const Post=require('../model/postModel');
const AppError=require('../utils/appError');


exports.createPost= catchAsync(async (req,res,next)=>
{
    const post=await Post.create({content:req.body.content,postedBy:req.user._id});
    res.status(200).json({
        status:"success",
        message:"post created",
        post
    });
});

exports.getAllPosts=catchAsync(async(req,res,next)=>
{

    const posts=await Post.find().populate('postedBy','name description');
    res.status(200).send({
        status:'success',
        total:posts.length,
        posts
    });
});

exports.deletePost=catchAsync(async(req,res,next)=>
{
    const post=await Post.findOne({_id:req.params.id,postedBy:req.user._id});
    if (!post) return next(new AppError(401,'You can only delete ur existing posts'));
    await Post.findOneAndDelete({_id:req.params.id});
        res.status(204).json({
        status:"success",
        message:"Post deleted"
    });
});