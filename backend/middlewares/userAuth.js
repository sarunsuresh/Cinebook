const express=require('express')
const jwt=require('jsonwebtoken')
const USER=require('../models/user')

const userVerify = async(req,res,next)=>{
    const header=req.headers.authorization
    try{
    if(!header){
        res.status(200).json({status:"no authentication"})
    }
    const token=header.split(" ")[1]
    const data=jwt.verify(token,process.env.SECRET)
    req.user={
        userId:data.userId
    }
next()
}catch(err){
    res.status(400).json({status:"auth error",err:err})
}
    

}

module.exports=userVerify