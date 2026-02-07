const express = require('express')
const authroute=require('./routes/auth')
const adminRoute=require('./routes/admin')
const userRoute=require('./routes/user')
const app=express()
const cors=require('cors')
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json())


app.use('/auth',authroute)
app.use('/admin',adminRoute)
app.use('/',userRoute)

module.exports=app;

