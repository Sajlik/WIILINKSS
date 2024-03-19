const mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    id : {
        type : String,
        required : true,
    },
   productName: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true,
        
    },
    regularPrice: { 
        type: Number, 
        required: true
    },
    salePrice: { 
        type: Number, 
        required: true
    },
   
    
    quantity: {
        type: Number,
        required: true
    },
    stock: {     
        type: Number,
        default: 0
    },
    productImage : {
        type : Array,
        required : true,
    },
        
    category : {
        type : String,
        required : true,
    },

       ratings: [{ 
        star: Number,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    isListed:{
        type:Boolean,
        default:true
    },
    isBlocked : {
        type : Boolean,
        default : false,
    },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Product', ProductSchema);