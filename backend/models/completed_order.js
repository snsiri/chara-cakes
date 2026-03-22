import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const completed_orderSchema = new Schema({
    
     _id: { 
            type: String,
        }, 
    customer_id: {
        type: String,
        required: true
    },
    product:[{
        _id: String,
        product_name: String,
        product_image: String,
        product_price: String,
        quantity: Number,
        added_date: Date,
        ingredients: [
            {
            _id: String,
                name: String,       // e.g., sugar
                quantity: Number,   // e.g., 200
                unit: String        // e.g., grams
            }
            ],

    }],
    customize:[{
        _id: String,
        custom_price: String,
        custome_image: String,
        quantity: Number,
        added_date: Date,
        ingredients: [
            {
            _id: String,
                name: String,       // e.g., sugar
                quantity: Number,   // e.g., 200
                unit: String        // e.g., grams
            }
            ],
    }],
    total_ingredients: [
        {
        _id: String,
            name: String,       // e.g., sugar
            quantity: Number,   // e.g., 200
            unit: String        // e.g., grams
        }
        ],
    deliveryAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: false,
    },
    
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    deliveryfee: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    },
    {
        timestamps: true,
    },
)



const Completed_Order = mongoose.model('Completed_Order', completed_orderSchema);

export default Completed_Order;