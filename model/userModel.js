const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:[true,'An account is already having that email id'],
        required:[true,'Email required'],
        lowercase:true,
        trim:true,
        validate:[validator.isEmail,'Invalid Email']
    },
    name:{type:String,required:[true,'Name required']},
    password:{type:String,minlength:8,required:[true,'Password required']},
    description:{type:String,maxlenght:50},
    passwordConfirm:
    {
        type:String,required:[true,'Confirm Password required'],
        validate:
        {// This only works on CREATE and SAVE!!!
            validator:function(e)
            {
                return this.password===e;
            },
            message:'Passwords dont match'
        }
    },
    joined:{type:Date,default:Date.now()},
    passwordResetToken:String,
    passwordResetTokenExpires:Date,
    passwordChangedAt:Date
});

userSchema.methods.isCorrectPassword=async function(pass)
{
    return await bcrypt.compare(pass,this.password);
}

userSchema.methods.changedPasswordAfter=function(JWTTimeStamp)
{
    if (!this.passwordChangedAt) return false;
    return parseInt(this.passwordChangedAt.getTime()/1000,10)>JWTTimeStamp;
};

userSchema.pre('save',async function(next)
{
    if (!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    if (!this.isNew) this.passwordChangedAt=Date.now()-1*1000;
    next();
});


const User=mongoose.model('User',userSchema);
module.exports=User;
