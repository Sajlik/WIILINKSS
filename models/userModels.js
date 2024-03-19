const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
   password: {
        type: String,
        required:true
    },
    createdOn: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: String,
        default: "0"
    },
    cart: {
        type: Array
    },
    
    wallet : {
        type : Number,
        default : 0
    },
    history : {
        type : Array
    }
});

module.exports = mongoose.model("User", userSchema);