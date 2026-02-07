const express=require('express')
const router=express.Router()
const { adminVerify } = require('../middlewares/adminVerify');
const { adminControl } = require('../controller/adminController');
router.post('/add-movie',adminVerify,adminControl)
module.exports=router