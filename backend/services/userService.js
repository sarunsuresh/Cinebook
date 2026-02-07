const Show=require('../models/show')
const Seats=require('../models/seat')
const Booking=require('../models/booking')
const Payment=require('../models/payment')
const Theatre=require('../models/theatre')
const Screen=require('../models/screen')
async function showList(data){
    const movieId=data
    try{
    const shows = await Show.find({ movieId: data })
        .populate('theatreId') 
        .populate('screenId');
    
    return shows
    }catch(err){
      console.log("error",err.message)
      throw err
    }
}

async function showSeats(data){
    const show=data
    const seats=await Seats.find({showId:show})
    return seats
}

async function seatLock(data, showId, user) {
  const seats = data.seats;
  const now = new Date();

  await Seats.updateMany(
    {
      status: "LOCKED",
      lockedAt: { $lt: new Date(now.getTime() - 5 * 60 * 1000) }
    },
    {
      $set: {
        status: "AVAILABLE",
        lockedAt: null,
        lockedBy: null
      }
    }
  );

  const result = await Seats.updateMany(
    {
      showId,
      seatNumber: { $in: seats },
      status: "AVAILABLE"
    },
    {
      $set: {
        status: "LOCKED",
        lockedAt: now,
        lockedBy: user.userId
      }
    }
  );

  if (result.modifiedCount !== seats.length) {
    
    await Seats.updateMany(
      {
        showId,
        seatNumber: { $in: seats },
        lockedBy: user.userId
      },
      {
        $set: {
          status: "AVAILABLE",
          lockedAt: null,
          lockedBy: null
        }
      }
    );
    return false;
  }

  return true;
}


async function bookingService(data){
    const showId=data.showId
    const seats=data.seats
    const seatStatus=await Seats.find({showId:showId,seatNumber:{$in:seats}},{seatNumber:1,status:1,price:1,lockedBy:1,_id:0})
    const invalid=seatStatus.some(s=>s.status!=='LOCKED'||s.lockedBy?.toString()!==data.userId)
    if(invalid){
        return false
    }
    const totalAmount=seatStatus.reduce((sum,seat)=>sum+seat.price,0)
    const booking = await Booking.create({
    userId: data.userId,     
    showId: data.showId,              
    seats: data.seats,                
    totalAmount: totalAmount,    
    status: "PENDING"

});
return booking

}

async function paymentService(data){
  bookingId=data.booking
  const booking=await await Booking.findById(
        bookingId
    );
  if(!booking){
    throw new Error("NO Booking ");
  }

  if (booking.status !== "PENDING") {
        throw new Error("Booking already processed");
    }

  
  await Booking.updateOne(
        { _id: bookingId },
        { $set: { status: "CONFIRMED" } }
    );

  await Payment.create({
  booking: booking._id,
  userId: booking.userId,
  amount: booking.totalAmount,
  method: "UPI",
  status: "SUCCESS",
  transactionId: "TXN_" + Date.now()
});


  return true


}


module.exports={showList,showSeats,seatLock,bookingService,paymentService}