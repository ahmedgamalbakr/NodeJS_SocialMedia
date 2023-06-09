const express=require('express');
const app=express();
const userRoutes = require('./routes/usersRoute')
const postRoutes = require("./routes/postsRoute")
const commentRoute = require("./routes/commentRoute")
const reviewRoute = require("./routes/reviewsRoute")
const {port} = require("./config.js")
app.use(express.json());
require('./db')




app.use('/users',userRoutes)
app.use('/posts',postRoutes);
app.use('/comments',commentRoute);
app.use('/reviews',reviewRoute);


app.listen(port,()=>{
    console.log("server is running on port  " + port);

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