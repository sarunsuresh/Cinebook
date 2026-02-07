const authservice=require('../services/authservice')

const signupcontroll=async(req,res)=>{
    try{
    
        const result=await authservice.signup(req.body)
        
        return res.status(201).json({status:"success",
            token:result.token,
            userId:result.userId
        })
    }
    catch(err){
        return res.status(400).json(err)

    }
}

const loginController=async(req,res)=>{
    const data=req.body
    const result=await authservice.login(data)

    return res.status(201).json({status:"success",
            token:result.token,
            userId:result.userId
        })

}

module.exports={
    signupcontroll,
    loginController
}