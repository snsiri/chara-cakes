const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const optionSchema = new Schema({
    _id: { 
        type: String,
    }, 
    option_name: {
        type: String,
        required: true,
    },
    option_flavor:{
        type: String,
        required: true,
    },
    option_size: {
        type: String,
        required: true
    },
    option_shape: {
        type: String,
        required: true
    },
    option_price: {
        type: Number,
        required: true
        
    },
    option_specifications: {
        type:String,
        required: false
    },
    ingredients: [
        {
            _id: String,
            name: String,       // e.g., sugar
            quantity: Number,   // e.g., 200
            unit: String        // e.g., grams
        }
    ],
    
    updated_date: {
        type: Date,
        required: false
    }

});

module.exports = Option = mongoose.model('Option', optionSchema);