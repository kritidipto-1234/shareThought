require('dotenv').config({path:`${__dirname}/config.env`});
const app=require('./app');
const mongoose=require('mongoose');

const DB=process.env.DATABASE_CONNECT_STRING.replace('<password>',process.env.DB_PASSWORD);

mongoose.connect(DB,{useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true})
.then(()=>console.log('DB successfully connected'))
.catch(console.log);

const server=app.listen(process.env.PORT,()=>
{
    console.log(`App running on port : ${process.env.PORT}`);
})

process.on('unhandledRejection',err=>
{
    console.log('Unhandled Rejection .Shutting down');
    console.log(err);
    server.close(()=>process.exit(1));
})

process.on('SIGTERM',err=>
{
    console.log('SIGTERM SIGNAL received .Shutting down');
    server.close(()=>console.log('Process terminated'));
});