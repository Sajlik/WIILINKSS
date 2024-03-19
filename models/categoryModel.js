const mongoose = require('mongoose')



const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
        type: String,
        required: true
    },
    isListed: {
        type: Boolean,
        default: true
    },
    
    description: {
        type:String,
        required:true
    },
    startDate: Date,
    endDate: Date,
    offer: Number,
})

const category = mongoose.model("Category", categorySchema)
module.exports = category