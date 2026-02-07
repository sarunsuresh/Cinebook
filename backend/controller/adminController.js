const adminService=require('../services/adminService')

const adminControl=async(req,res)=>{
    try{
        const result=await adminService.addMovie(req.body)
        return res.status(200).json({status:"movie added",
            movie:result
        })
    }
    catch(err){
        console.log(err);
        
    }
}

module.exports={
    adminControl
}