const mongoose=require('mongoose');

const postSchema=mongoose.Schema(
{
    postedBy:{type:mongoose.Schema.ObjectId,ref:'User',required:[true,'Post Must belong to a user']},
    createdAt:{type:Date,default:Date.now()},
    content:{type:String,maxlength:140,required:[true,'Post must have some content']}
});

const Post=new mongoose.model('Post',postSchema);

module.exports=Post;