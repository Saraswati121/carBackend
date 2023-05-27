const Router = require("express")
const authRoute = Router()
const authmodel = require("../models/authModel")
const jwt = require('jsonwebtoken');

authRoute.post("/signup", async (req, res) => {
    try {
      const userMail = await authmodel.findOne({ email: req.body.email });
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

      if (!req.body.userName || !req.body.email || !req.body.password) {
        return res.status(422).send({ message: "Please fill in all the details." });
      }
  
      if (userMail) {
        return res.send({ message: "User already registered." });
      }
      if (!passwordRegex.test(req.body.password)) {
        return res.status(400).send({
          message:
            "Password must contain at least 8 characters, including at least 1 number, 1 lowercase letter, and 1 uppercase letter.",
        });
      }
    
      if (!emailReg.test(req.body.email)) {
        return res
          .status(400)
          .send({ message: "Please provide a valid email address." });
      }
  
      const user = new authmodel(req.body);
      await user.save();
      return res.status(201).send({ message: "Signup successful", authmodel: user });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "An error occurred while signing up." });
    }
});
  
authRoute.post("/login",async(req,res) => {
   try {
    const {email,password} = req.body
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let validemail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !password) {
        return res.status(422).send({ message: "fill all the details" });
    }
   
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including at least 1 number, 1 lowercase letter, and 1 uppercase letter.",
      });
    }

    if(!validemail.test(email)){
      return res.status(422).send({ message: "please enter a valid email address" });
    }
    const validUser = await authmodel.findOne({email,password})

    if(!validUser){
        return res.status(401).send({message: "Invalid credential"})
    }
    const token = jwt.sign({
        userName : validUser.lastName,
        email : validUser.email,
        password : validUser.password
    },'Secret')
    return res.status(201).send({message:"login successful",validUser,token})
   } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "An error occurred while sign in." });
   }
})

module.exports= authRoute