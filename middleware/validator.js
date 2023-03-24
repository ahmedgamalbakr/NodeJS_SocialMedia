const Joi=require('joi')


const signUpSchema=Joi.object(
    {
        username: Joi.string().min(3).max(20).required(),
        age:Joi.number(),
        role:Joi.string().required(),
        password: Joi.string().min(3).max(20).required(),
       

    }
)

const validateSignUp= (req,res,next)=>{
    const {error}=signUpSchema.validate(req.body);
    if(error){
        const error=new Error("invalid inputs")
        error.status=400;
        return next(error);
    }
    next();
}


const loginSchema=Joi.object(
    {
        username: Joi.string().min(3).max(20).required(),
        password: Joi.string().min(3).max(20).required()
    }
)

const validateLogin= (req,res,next)=>{
    const {error}=loginSchema.validate(req.body);
    if(error){
        const error=new Error("invalid inputs")
        error.status=400;
        return next(error);
    }
    next();
}



module.exports={
    validateLogin,validateSignUp
};

