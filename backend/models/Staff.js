import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const roleHistorySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      ref: "Role",
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      default: null // null = currently active
    }
  },
  { _id: false }
);

const staffSchema = new Schema({
    
    _id: { 
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true,
    },
    birthdate:{
        type: Date,
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    roles: [
        roleHistorySchema
    ],
    image: {
        type: String,
        
    },
    password: {
        type: String,
        required: true
    },
    CreatedOn: {
        type: Date,
        required: true
    },    
    last_updated_At:{
        type: Date,
        required: true
      }

}, { timestamps: true });

//Save updated password
staffSchema.pre("save", async function (next) {
    if (!this.isModified("password")){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Match PW for login
staffSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


//To get current role of the staff
staffSchema.methods.getCurrentRole = function () {
     if (!this.roles || this.roles.length === 0) return null;
    return this.roles.find(r => r.to === null);
};


const Staff = mongoose.model('Staff', staffSchema);

export default Staff;

