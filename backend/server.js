require('dotenv').config()
const app=require('./app')
const mongoose =require('mongoose')
console.log(process.env.URL)
mongoose.connect(process.env.URL).then(()=>{
    console.log('connected')
})
app.listen(process.env.PORT,()=>{
    console.log('started running')
})

