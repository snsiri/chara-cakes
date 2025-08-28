// 
const express = require('express');
const router = express.Router();
const Customize = require('../models/Customize');
const Option = require('../models/Option');
const Ingredient2 = require('../models/Ingredient2');
const getNextSequenceValue = require("../utils/sequence");
const getSequenceValue = require("../utils/sequence");
const prefix = "CSM-";

// Get all customizes
router.get('/', async (req, res) => {
  try {
    const customizes = await Customize.find().sort({ createdAt: -1 });
    res.json({
      status: 'Success',
      data: customizes
    });
  } catch (error) {
    console.error('Error fetching customizes:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch customizes',
      error: error.message
    });
  }
});

router.get('/get/:id', async (req, res) => {
  try {
    const customizeId = req.params.id;

    // Find the customize by ID
    const customize = await Customize.findById(customizeId);

    // If not found, return 404
    if (!customize) {
      return res.status(404).json({
        status: 'Error',
        message: `Customize with ID ${customizeId} not found`
      });
    }

    // Return the found customize
    res.status(200).json({
      status: 'Success',
      message: 'Customize retrieved successfully',
      data: customize
    });

  } catch (error) {
    console.error('Error fetching customize:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to retrieve customize',
      error: error.message
    });
  }
});


// Add new customize
router.post('/add', async (req, res) => {
  try {
    const {
      custom_layers,
      custom_size,
      custom_shape,
      custom_bases,
      custom_filling,
      custom_frosting,
      custom_decorations,
      custom_price,
      custom_specifications,
      ingredients,
      last_updated_At
    } = req.body;

    // Validate required fields
    if (
      !custom_layers||
      !custom_size ||
      !custom_shape ||
      !custom_bases ||
      !Array.isArray(custom_bases) ||
      custom_bases.length < 1 ||
      !custom_filling ||
      !custom_frosting ||
      !custom_decorations
    ) {
      return res.status(400).json({
        status: 'Error',
        message: 'Missing required fields'
      });
    }

    // Validate size and shape
    if (!['6', '8', '10', '12'].includes(custom_size)) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid size. Must be one of: 6, 8, 10, 12'
      });
    }

    if (!['round', 'square', 'heart'].includes(custom_shape.toLowerCase())) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid shape. Must be one of: round, square, heart'
      });
    }

    // Merge and sum all ingredient quantities
function mergeIngredients(arrays) {
  const merged = {};
  arrays.flat().forEach(ing => {
    if (!ing) return;
    const key = ing._id;
    if (merged[key]) {
      merged[key].quantity += ing.quantity;
    } else {
      merged[key] = { ...ing };
    }
  });
  return Object.values(merged);
}

const allIngredients = [
  ...(custom_bases || []).flatMap(base => base?.ingredients || []),
  ...(custom_filling || []).flatMap(filling => filling?.ingredients || []),
  ...(custom_frosting?.ingredients ? custom_frosting.ingredients : []),
  ...(custom_decorations?.ingredients ? custom_decorations.ingredients : [])
];
const custom_ingredients = mergeIngredients([allIngredients]);


    const sequenceName = "customizeid";
    const newId = await getNextSequenceValue(prefix, sequenceName);

    // Create new customize
    const newCustomize = new Customize({
      _id: newId,
      custom_layers,
      custom_size,
      custom_shape: custom_shape.toLowerCase(),
      custom_bases,
      custom_filling,
      custom_frosting,
      custom_decorations,
      custom_price,
      custom_specifications: custom_specifications || '',
      custom_ingredients,
      last_updated_At: new Date()
    });
    

    await newCustomize.save();
    res.status(201).json({
      status: 'Success',
      message: 'Customize added successfully',
      data: newCustomize
    });

  } catch (error) {
    console.error('Error adding customize:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to add customize',
      error: error.message
    });
  }
});

// Get available options for customization
router.get('/available-options', async (req, res) => {
  try {
    const { size, shape } = req.query;

    if (!size || !shape) {
      return res.status(400).json({
        status: 'Error',
        message: 'Size and shape are required'
      });
    }

    // Get all options matching the size and shape
    const options = await Option.find({
      option_size: size,
      option_shape: shape.toLowerCase()
    });

    // Group options by type
    const groupedOptions = {
      cake_base: options.filter(opt => opt.option_name === 'cake base'),
      filling: options.filter(opt => opt.option_name === 'filling'),
      frosting: options.filter(opt => opt.option_name === 'frosting'),
      decorations: options.filter(opt => opt.option_name === 'decorations')
    };

    res.json({
      status: 'Success',
      data: groupedOptions
    });

  } catch (error) {
    console.error('Error fetching available options:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch available options',
      error: error.message
    });
  }
});



router.put('/update/:id', async (req, res) => {
  try {
    // Remove _id from the update payload if present
    const updateData = { ...req.body };
    delete updateData._id;

    // If any of the main fields are being updated, recalculate custom_ingredients
    const fieldsToCheck = [
      'custom_layers',
      'custom_size',
      'custom_shape',
      'custom_bases',
      'custom_filling',
      'custom_frosting',
      'custom_decorations',
      'custom_price'
    ];
    let shouldRecalculate = false;
    for (const field of fieldsToCheck) {
      if (field in updateData) {
        shouldRecalculate = true;
        break;
      }
    }

    if (shouldRecalculate) {
      // Use the updated fields if present, otherwise fetch from DB
      const existing = await Customize.findById(req.params.id);
      const bases = updateData.custom_bases || existing.custom_bases;
      const fillings = updateData.custom_filling || existing.custom_filling;
      const frosting = updateData.custom_frosting || existing.custom_frosting;
      const decorations = updateData.custom_decorations || existing.custom_decorations;
      function mergeIngredients(arrays) {
        const merged = {};
        arrays.flat().forEach(ing => {
          if (!ing) return;
          const key = ing._id;
          if (merged[key]) {
            merged[key].quantity += ing.quantity;
          } else {
            merged[key] = { ...ing };
          }
        });
        return Object.values(merged);
      }
      const allIngredients = [
        ...(bases || []).flatMap(base => base?.ingredients || []),
        ...(fillings || []).flatMap(filling => filling?.ingredients || []),
        ...(frosting?.ingredients ? frosting.ingredients : []),
        ...(decorations?.ingredients ? decorations.ingredients : [])
      ];
      updateData.custom_ingredients = mergeIngredients([allIngredients]);
    }

    // Before update, set last_updated_At to now
    updateData.last_updated_At = new Date();
    const updatedCustomize = await Customize.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCustomize) {
      return res.status(404).json({ status: 'Error', message: 'Customize not found' });
    }
    res.json({ status: 'Success', message: 'Customize updated', data: updatedCustomize });
  } catch (error) {
    console.error('Error updating customize:', error);
    res.status(500).json({ status: 'Error', message: 'Failed to update customize', error: error.message });
  }
});
// ... existing code ...



// Delete a customize by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCustomize = await Customize.findByIdAndDelete(req.params.id);
    if (!deletedCustomize) {
      return res.status(404).json({ status: 'Error', message: 'Customize not found' });
    }
    res.json({ status: 'Success', message: 'Customize deleted', data: deletedCustomize });
  } catch (error) {
    console.error('Error deleting customize:', error);
    res.status(500).json({ status: 'Error', message: 'Failed to delete customize', error: error.message });
  }
});


module.exports = router; 