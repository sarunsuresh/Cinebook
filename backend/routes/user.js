const express=require('express')
const router=express.Router()
const Movie=require('../models/movie')
const userController=require('../controller/userController')
const userVerify=require('../middlewares/userAuth')
const Bookings=require('../models/booking')
router.get('/movies',async (req,res)=>{
    const movies=await Movie.find({})
    res.status(200).json({status:"success",
        movies:movies
    })
})

router.get('/movies/:movieId/shows',userController.showController)

router.get('/shows/:showId/seats',userController.seatController)

router.post('/shows/:showId/lock',userVerify,userController.seatLockcontroller)

router.post('/booking',userVerify,userController.bookingController)

router.post('/payment',userVerify,userController.paymentController)

router.get('/:id', async (req, res) => {           
  const booking = await Bookings.findById(req.params.id).populate('showId');
  res.json(booking);
});

router.get('/user/:userId',async (req,res)=>{
    const userId=req.params.userId
    try{
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: "error", message: "Invalid User ID format" });
        }
    const userBookings = await Bookings.find({ userId: userId })
      .populate('showId') 
      .sort({ createdAt: -1 });

      res.status(200).json({status:true,Bookings:userBookings})
    }catch(err){
        res.status(400).json({status:"error",error:err.message})
    }
})
module.exports=router 