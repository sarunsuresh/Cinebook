const express=require('express')
const jwt=require('jsonwebtoken')
const adminVerify=async (req,res,next)=>{
    const requirerole='ADMIN'
    header=req.headers.authorization
    if(!header){
        return res.status(400).json({status:"failed"})
    }
    token=header.split(" ")[1]
    if(!token){
        return res.status(400).json({status:"failed"})
    }
    data=await jwt.verify(token,process.env.SECRET)
    if(data.role==requirerole){
        next()
    }
    else{
        return res.status(400).json({status:"failed"})
    }

    
}
module.exports={
    adminVerify
}