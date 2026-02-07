const express=require('express')
const router=express.Router()
const authcontroller=require('../controller/authcontroller')

router.post('/signup',authcontroller.signupcontroll)
router.get('/',(req,res)=>{
    res.send("this is home")
})
router.post('/login',authcontroller.loginController)

module.exports=router