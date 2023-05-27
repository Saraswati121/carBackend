const mongoose = require ("mongoose")

const AuthSchema = mongoose.Schema({
    userName:{type:String,required:true},
    email: {type:String, required:true},
    password: {type:String, required:true}
})

const AuthModel = mongoose.model('auth', AuthSchema)

module.exports= AuthModel