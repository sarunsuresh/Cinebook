const userService=require('../services/userService')

const showController=async(req,res)=>{
    const data=req.params.movieId
   
    
    try{
    shows=await userService.showList(data)
    res.status(200).json({status:"success",shows:shows})
    }catch(err){
        res.status(400).json({"error":err.message})
    }
}

const seatController=async(req,res)=>{
    const showId=req.params.showId
    try{
    const seats=await userService.showSeats(showId)
    res.status(200).json({
        status:"success",
        seats:seats
    })}
    catch(err){
        res.status(400).json({error:err.message})
    }
    

}

const seatLockcontroller=async(req,res)=>{
    data=req.body
    user=req.user
    console.log(data)
    id=req.params.showId
    console.log(id)

    try{
        const s=await userService.seatLock(data,id,user)
        if(s){
            res.status(200).json({status:"locked 5 minutes left for payment"})
        }
        else{
            res.json({status:'error, already booked'})
        }
    }catch(err){
        res.status(400).json({status:'error',error:err.message})
    }
}

const bookingController=async(req,res)=>{
    showId=req.body.showId
    userId=req.user.userId
    data={
        showId,
        userId,
        seats:req.body.seats
    }
    try{
        const booking=await userService.bookingService(data)
        if(!booking){
            res.status(400).json({status:"seats not locked"})
        }
        res.status(200).json({status:"success",booking:booking})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

const paymentController=async (req,res)=>{
    try{
        const data=req.body
        await userService.paymentService(data)
        res.status(200).json({status:"payment success"})
    }catch(err){
        res.status(400).json({error:err.message})
    }
}



module.exports={
    showController,
    seatController,
    seatLockcontroller,
    bookingController,
    paymentController
}