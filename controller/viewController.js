const catchAsync=require('../utils/catchAsync');
const AppError=require('../utils/appError');

exports.getLandingPage=catchAsync(async (req,res,next)=>
{
    res.status(200).render('landingPage',
    {
        title:'Landing Page',
        headerLeft:'Welcome To ShareThought',
        headerRight:'Not logged in'
    });
});

exports.getGlobalPage=catchAsync(async(req,res,next)=>
{
    res.status(200).render('globalPage',
    {
        title:'Global Page',
        headerLeft:'Global Feed',
        headerRight:`${req.user.name}`
    });
});

exports.getResetPasswordPage=catchAsync(async(req,res,next)=>
{
    res.status(200).render('resetPasswordPage',
    {
        title:'Change Password Page',
        headerLeft:'HomePage',
        headerRight:`Change Password`
    })
});

exports.getAccountPage=catchAsync(async(req,res,next)=>
{
    if (req.user.id==req.params.id)// get self account
    {
        res.status(200).render('myAccountPage',
        {
            title:'My Account Page',
            headerLeft:'Global Feed',
            headerRight:`Logout`
        });
    }
    else //view others account
    {
        res.status(200).render('userProfilePage',
        {
            title:'User Profile Page',
            headerLeft:'Global Feed',
            headerRight:`${req.user.name}`
        });  
    }
});