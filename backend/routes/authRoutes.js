const login=require("../controller/authController").login;
const register=require("../controller/authController").register;
const router=require("express").Router();

// Register
router.post("/register",register);
// Login
router.post("/login",login);
module.exports=router;  