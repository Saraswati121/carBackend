const express= require('express');
const connections = require('./src/config/db')
const authentication = require("./src/controller/auth")
const cars = require("./src/controller/cars")
const app = express();
const cors= require('cors')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.use("/auth",authentication)
app.use('/',cars)

app.get('/',(req,res)=>{
    res.send({message : 'welcome to buycars.com'}); 
})

const port = process.env.PORT || 8080;
app.listen(port,async()=>{
    await connections;
    console.log('listening on port 8080');
})