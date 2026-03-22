import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    _id: { 
        type: String,
        required: true
    }, 

    customer_id: {
        type: String,
        required: true,
        unique: true
    },

    product:[{
        _id: String,
        product_name: String,
        product_image: String,
        product_price: String,
        quantity: Number,
        ingredients: [
            {
                _id: String,
                name: String,       // e.g., sugar
                quantity: Number,   // e.g., 200
                unit: String        // e.g., grams
            }
        ],
        added_date: Date,

    }],
    customize:[{
        _id: String,
        custom_price: String,
        custom_image: String,
        quantity: Number,
        ingredients: [
            {
                _id: String,
                name: String,       // e.g., sugar
                quantity: Number,   // e.g., 200
                unit: String        // e.g., grams
            }
        ],
        added_date: Date
    }]
    

}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;