
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    
    _id: { 
        type: String,
    }, 
    name: {
        type: String,
        required: true,
    },
    birthdate:{
        type: Date,
    },
    gender:{
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    CreatedOn: {
        type: Date,
        //required: true
    },    
    last_updated_At:{
        type: Date,
        // required: true
    }
}, { timestamps: true });

customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

customerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;