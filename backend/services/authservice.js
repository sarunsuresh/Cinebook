const jwt=require('jsonwebtoken')
const User=require('../models/user')
const bcrypt=require('bcrypt')

const signup=async (data)=>{
    console.log(data)
    email=data.email
    const existuser=await User.findOne({email})

    if(existuser){
        throw new Error("user existing ")
    }
    console.log('reached')
    hashedpassword= await bcrypt.hash(data.password,10);
    console.log('reached hash')
    
    const user=await User.create({
        name:data.name,
        email:data.email,
        password:hashedpassword,
        role:data.role
    })
    console.log(user);
    console.log('reached jwt')
    token=jwt.sign(
  {
    userId:user._id,
    role: user.role
  },
  process.env.SECRET,
  { expiresIn: '1h' }
);
console.log('token',token);

    return {
        userId:user._id,
        token
    }
}

const login=async(data)=>{
    email=data.email
    password=data.password
    const user=await User.findOne({email:email})
    if(!user){
        throw new Error("user not found ")
    }

    const exist=await bcrypt.compare(password,user.password);
    if(!exist){
        throw new Error("incorrect password ");
    }
    token=jwt.sign({
        userId:user._id,
        role:user.role
    },
process.env.SECRET,{
    expiresIn:"1h"
}


)
return {
    status:"login succcesfull",
    token:token,
    userId:user._id
    
}

}

module.exports={
    signup,
    login
}