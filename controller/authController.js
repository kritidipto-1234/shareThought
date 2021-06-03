const catchAsync=require('../utils/catchAsync');
const jwt=require('jsonwebtoken');
const User=require('../model/userModel');
const AppError=require('../utils/appError');
const crypto=require('crypto');
const sendEmail=require('../utils/email');
const util=require('util');

exports.generateAccessToken=(content)=>
{
    return jwt.sign(content,process.env.JWT_SECRET_STRING,{expiresIn:process.env.JWT_EXPIRES_IN});
}

exports.createUser= catchAsync(async (req,res,next)=>
{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        description:req.body.description,
        passwordConfirm:req.body.passwordConfirm
    });

    newUser.password=undefined;

    const jwtToken=exports.generateAccessToken({id:newUser._id});
    res.cookie('jwt',jwtToken,
    {
        // httpOnly:true,
        expires:new Date(Date.now()+1000*process.env.JWT_COOKIE_EXPIRES_IN)
    });
    res.status(201).json({
        "status":"success",
        newUser,
        jwtToken
    });
});

exports.login=catchAsync(async (req,res,next)=>
{
    const {email,password}=req.body;
    if (!email || !password) return next(new AppError('400','Please enter a valid email & password'));
    const user=await User.findOne({email});
    if (!user || !(await user.isCorrectPassword(password))) return next(new AppError('401','Invalid emailID/password'));

    const jwtToken=exports.generateAccessToken({id:user._id});
    res.cookie('jwt',jwtToken,
    {
        // httpOnly:true,
        expires:new Date(Date.now()+1000*process.env.JWT_COOKIE_EXPIRES_IN)
    });
    res.status(201).json({
        "status":"success",
        jwtToken
    });
});

exports.forgotPassword=catchAsync(async(req,res,next)=>
{
    const user=await User.findOne({email:req.body.email});
    if (!user) return next(new AppError(400,'Invalid Email ID'));

    const resetToken=crypto.randomBytes(32).toString('hex');
    user.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetTokenExpires=Date.now()+10*60*1000;
    
    try
    {
        console.log(req.protocol,req.get('host'));
        const url=`${req.protocol}://${req.get('host')}/api/users/changePassword/${resetToken}`;
        const message=`To change ur password click on this button.`;
        await sendEmail('resetPassword',
            {
                email:user.email,
                message,
                subject:'ShareThought Password Reset(valid for 10 mins)',
                url
            });
        user.save({validateBeforeSave:false});
            
        res.status(200).json({
            status:"success",
            message:'Token send to the entered email'
        });
    }
    catch(err)
    {
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpires=undefined;
        user.save({validateBeforeSave:false});
        return next(new AppError(500,'Error sending Email'));
    }
});

exports.resetPassword=catchAsync(async(req,res,next)=>
{
    const passwordResetToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user=await User.findOne(
    {
        passwordResetToken,
        passwordResetTokenExpires:{ $gt:Date.now() }
    });
    if (!user) return next(new AppError(400,'Invalid/Expired Token'));

    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpires=undefined;
    await user.save();

    res.status(201).json({
        "status":"success",
        "message":"Password changed"
    });
});

exports.protect=catchAsync(async(req,res,next)=>
{
    let jwtToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    jwtToken=req.headers.authorization.split(' ')[1];

    jwtToken=jwtToken||req.cookies.jwt;
    
    if (!jwtToken) return next(new AppError(401,'You are not logged in'));
    
    const decoded=await util.promisify(jwt.verify)(jwtToken,process.env.JWT_SECRET_STRING);

    const user=await User.findOne({_id:decoded.id});
    if (!user) return next(new AppError(400,'User doesnt exist anymore'));

    if (user.changedPasswordAfter(decoded.iat)) return next(new AppError(401,'Recently Password changed'));

    req.user=user;
    next();
});

exports.logout=catchAsync(async (req,res,next)=>
{
    res.cookie('jwt','random-invaid-jwt-token',
    {
        // httpOnly:true,
        expires:new Date(Date.now()+1000*process.env.JWT_COOKIE_EXPIRES_IN)
    });
    res.status(200).json({
        "status":"success",
        "message":"You logged out",
        jwtToken:'random-invaid-jwt-token'
    });
});