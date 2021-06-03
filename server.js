require('dotenv').config({path:`${__dirname}/config.env`});
const app=require('./app');
const mongoose=require('mongoose');

const DB=process.env.DATABASE_CONNECT_STRING.replace('<password>',process.env.DB_PASSWORD);

mongoose.connect(DB,{useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true})
.then(()=>console.log('DB successfully connected'))
.catch(console.log);

app.listen(process.env.PORT,()=>
{
    console.log(`App running on port : ${process.env.PORT}`);
})

