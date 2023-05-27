const mongoose = require ("mongoose")

const carSchema = mongoose.Schema({
    title: String,
    image: String,
    contentType: String,
    bulletPoints: { type: [String] },
    price: Number,
    color: String,
    mileage: Number
})

const carModel = mongoose.model('cars',carSchema)
module.exports = carModel;