const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const completed_orderSchema = new Schema({
    
     _id: { 
            type: String,
        }, 
        customer: {
            type: String,
            required: false,
            ref: 'Customer',
        },
        product:[{
            _id: String,
            product_name: String,
            cprduct_image: String,
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



module.exports = Completed_order = mongoose.model('Completed_order', completed_orderSchema);