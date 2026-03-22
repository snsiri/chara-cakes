import mongoose from 'mongoose';
import { type } from 'os';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    
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
        custom_image: String,
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
        required: true,
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
    deliveryDate:{
        type:Date,
        required:false,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deliveredAt: {
        type: Date,
        required: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
}
); 

const Order = mongoose.model('Order', orderSchema);

export default Order;