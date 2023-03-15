const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
 username:String,
 age:Number,
 role:{
        type:String,
        enum:['admin','creator','user']
    },
 password:{
        type:String,
        required:true},
 
},
{
    toJSON:{
        transform:(doc,ret)=>{
            delete ret.password;
            delete ret.__v;
            return ret;

        }
    }
})
const User=mongoose.model('user',userSchema);
module.exports=User;
