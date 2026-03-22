 import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ingredientStockSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true, unique: true },
  stock_quantity: { type: Number, required: true },
  unit: { type: String, required: true }
});

const IngredientStock = mongoose.model('IngredientStock', ingredientStockSchema);

export default IngredientStock;
