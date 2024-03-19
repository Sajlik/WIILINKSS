const mongoose = require("mongoose");
const connectDB=mongoose.connect("mongodb+srv://sajli72002:1234@cluster0.mhpbh3h.mongodb.net/")

connectDB
         .then(()=>console.log("Database connected"))
         .catch((err)=>console.log(err.message));