const express = require('express')
const authroute=require('./routes/auth')
const adminRoute=require('./routes/admin')
const userRoute=require('./routes/user')
const app=express()
app.use(express.json())
require('dotenv').config()
const cors=require('cors')
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true
}));

const mongoose =require('mongoose')
console.log(process.env.URL)
mongoose.connect(process.env.URL).then(()=>{
    console.log('connected')
})

app.use('/auth',authroute)
app.use('/admin',adminRoute)
app.use('/',userRoute)

module.exports=app;

