const express=require('express');
const app=express();
const userRoutes= require('./routes/usersRoute')
app.use(express.json());
require('./db')
const port=3000;





app.use('/users',userRoutes)
 



app.listen(port,()=>{
    console.log("server is running in port  " + port);

});


// error handler
app.use((err,req,res,next)=>{

    err.statusCode=err.statusCode || 500 ;
    console.log('from error handler');
    res.status(err.statusCode).json({
        status:'error',
        message:err.message
        
    })

});