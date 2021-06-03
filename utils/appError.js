class AppError
{
    constructor(statusCode,message)
    {
        this.statusCode=statusCode;
        this.message=message;
        this.isIdentified=true;
    }
}

module.exports=AppError;