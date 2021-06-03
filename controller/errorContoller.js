const AppError=require('../utils/appError');

const handleDuplicateFieldsDB = err => 
{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400,message);
};

function sendDevError(req,res,err)
{
    if (err.code===11000) err=handleDuplicateFieldsDB(err);
    res.status(err.statusCode||500).json({
        "status":"failure",
        error:err
    });
}

function sendProdError(req,res,err)
{
    res.status(err.statusCode).json({
        "status":"failure",
        "message":err.message
    });
}

const globalErrorHander=function(err,req,res,next)
{
    err.statusCode=err.statusCode||500;
    sendDevError(req,res,err);
}

module.exports=globalErrorHander;