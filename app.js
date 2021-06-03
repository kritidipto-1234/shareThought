const express=require('express');
const morgan=require('morgan');
const path=require('path');
const mongoose=require('mongoose');
const userRouter=require('./routes/userRoute');
const postRouter=require('./routes/postRoute');
const viewRouter=require('./routes/viewRoute');
const globalErrorHander=require('./controller/errorContoller');
const cookieParser=require('cookie-parser');
const compression=require('compression');

const app=express();

app.set('view engine','pug');
app.set('views',`${__dirname}/views`);
app.use(morgan('dev'));

app.enable('trust proxy');

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use((req,res,next)=>
{
    next();
});
app.use(express.static(`${__dirname}/public`));


app.use('/',viewRouter);
app.use('/api/users',userRouter);
app.use('/api/posts',postRouter);


app.all('*',(req,res,next)=>{
    next('No such route defined');
});

app.use(globalErrorHander);

module.exports=app;
