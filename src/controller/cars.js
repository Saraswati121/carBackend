const Router = require("express")
const carRoute = Router()
const multer = require("multer");
const path = require("path");
const carModel = require("../models/carModel")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = file.fieldname + "-" + Date.now() + ext;
      cb(null, filename);
    },
  });
const upload = multer({ storage });

carRoute.post('/createcars',upload.single("image"),async(req,res)=>{
    try {
        const { title, bulletPoints, price,color,mileage } = req.body;
        const image = req.file ? req.file.filename : null;
        if(!title || !bulletPoints || !price || !color || !mileage){
            return res.status(422).send({ message: "fill all the details" }); 
        }
        if(isNaN(price)){
            return res.status(422).send({ message: "price should be a number" });
        }
        const newCar = new carModel({
            title,
            image:image,
            contentType: req.file.mimetype,
            bulletPoints,
            price,
            color,
            mileage
        });
        await newCar.save();
        res.status(200).send({ message: "cars saved successfully" });
    } catch (error) {
        console.error('Error creating service request:', err);
        res.status(500).json({ error: 'Server error', specificError: err.message }); 
    }
})

carRoute.get('/viewcars',async(req,res)=>{
    try {
      const carDetails = await carModel.find();
      res.status(200).send({ message: 'carDetails',carDetails})  
    } catch (error) {
        res.status(500).send({ message: 'Server Error', error});
    }
})

carRoute.patch('/updatecars/:id',async(req,res)=>{
    try {
    const {id} = req.params;
    const updateData = req.body
    const reqData = await carModel.findByIdAndUpdate(id, updateData,{new:true});
    return res.status(200).send(reqData);
    } catch (error) {
      console.error('Error updating service request:', err);
      res.status(500).json({ error: 'Server error' });
    }
})

carRoute.delete('/deletecars/:id',async(req,res)=>{
    try {
        const {id} = req.params
    const carDelete = await carModel.findByIdAndDelete(id);
    res.status(200).send({ message: 'car deleted successfully'});
    } catch (error) {
        console.error('Error deleting service request:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

module.exports = carRoute