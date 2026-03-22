
import express from 'express';
const router = express.Router();
import IngredientStock from '../models/IngredientStock.js';
import getNextSequenceValue from '../utils/sequence.js';
const prefix = "ING-";


http://localhost:3000/api/ingredientstock/add

router.post('/add', async (req, res) => {
    try {
        // Get the next sequence number (example: 1, 2, 3, ...)
        
        const sequenceName = "ingredienttid";
      const newId = await getNextSequenceValue(prefix, sequenceName);
        // Create a new ingredient with generated _id + request body
        const ingredientstock = new IngredientStock({
            _id: newId,
            name: req.body.name,
            stock_quantity: req.body.stock_quantity,
            unit: req.body.unit
        });

        await ingredientstock.save();
        res.json({ message: 'Ingredient added successfully', _id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


http://localhost:3000/api/ingredientstock

router.get('/', async (req, res) => {
    const ingredients = await IngredientStock.find();
    res.json(ingredients);
  });




  http://localhost:3000/api/ingredientstock/update/fccfg

router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        const updatedIngredient = await IngredientStock.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json({
            message: 'Ingredient updated successfully',
            ingredient: updatedIngredient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;