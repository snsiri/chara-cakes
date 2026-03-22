import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    _id: { 
        type: String,
        required: true
    }, 

    customer_id: {
        type: String,
        required: true
    },
    
    customer_name: { 
        type: String 
    },

    order_id:{
        type: String,
        required: true
    },

    product_id:{
        type: String,
        required: true
    },
    feedback_text:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    isHidden: { 
        type: Boolean, 
        default: false 
    } // Admin toggle


}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;