import mongoose from 'mongoose';

const customizeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  customer_Id:{
    type:String,
    required:false
  },
  custom_layers: {
    type: Number,
    required: true,
    min: 1
  },
  custom_size:{
    type: String,
  },
  custom_shape:{
    type: String,
  },
  custom_bases: [{
    _id: String,
    option_flavor: String,
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  }],
  custom_filling: [{
    _id: String,
    option_flavor: String,
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  }],
  custom_frosting: {
    _id: String,
    option_flavor: String,
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  },
  custom_decorations: {
    _id: String,
    option_flavor: String,
    option_price: Number,
    ingredients: [{
      _id: String,
      name: String,
      quantity: Number,
      unit: String
    }]
  },
  custom_image:{
    type: String,
    required: false
  },
  custom_price: {
    type: Number,
    required: true
  },
  custom_ingredients: [{
    _id: String,
    name: String,
    quantity: Number,
    unit: String
  }],
  last_updated_At:{
    type: Date,
    required:true
  },
  
});

const Customize = mongoose.model('Customize', customizeSchema);

export default Customize;