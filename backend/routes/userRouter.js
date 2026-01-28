const getAllUsers= require("../controller/userController").getAllUsers;
const router=require("express").Router();
router.get("/",getAllUsers);
module.exports=router;