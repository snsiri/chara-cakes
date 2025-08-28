const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Customize = require('../models/Customize');

// Helper: get or create cart (single cart for now, _id: 'main')
async function getOrCreateCart() {
  let cart = await Cart.findById('main');
  if (!cart) {
    cart = new Cart({ _id: 'main', product: [], customize: [] });
    await cart.save();
  }
  return cart;
}

// View cart
router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Add product to cart
router.post('/add-product', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ status: 'Error', message: 'Product not found' });
    const cart = await getOrCreateCart();
    const idx = cart.product.findIndex(p => p._id === product_id);
    if (idx !== -1) {
      cart.product[idx].quantity += quantity;
    } else {
      cart.product.push({
        _id: product._id,
        product_name: product.product_name,
        product_price: product.product_price,
        product_image: product.product_image,
        ingredients: product.ingredients,
        quantity,
        added_date: new Date()
      });
    }
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Add customize to cart
router.post('/add-customize', async (req, res) => {
  try {
    const { customize_id, quantity = 1 } = req.body;
    const customize = await Customize.findById(customize_id);
    if (!customize) return res.status(404).json({ status: 'Error', message: 'Customize item not found' });
    const cart = await getOrCreateCart();
    const idx = cart.customize.findIndex(c => c._id === customize_id);
    if (idx !== -1) {
      cart.customize[idx].quantity += quantity;
    } else {
      cart.customize.push({
        _id: customize._id,
        custom_price: customize.custom_price,
        quantity,
        ingredients: customize.custom_ingredients,
        added_date: new Date()
      });
    }
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Delete product from cart
router.delete('/remove-product/:product_id', async (req, res) => {
  try {
    const cart = await getOrCreateCart();
    cart.product = cart.product.filter(p => p._id !== req.params.product_id);
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Delete customize from cart
router.delete('/remove-customize/:customize_id', async (req, res) => {
  try {
    const cart = await getOrCreateCart();
    cart.customize = cart.customize.filter(c => c._id !== req.params.customize_id);
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Increase quantity
router.post('/increase', async (req, res) => {
  try {
    const { type, id } = req.body; // type: 'product' or 'customize'
    const cart = await getOrCreateCart();
    let found = false;
    if (type === 'product') {
      const item = cart.product.find(p => p._id === id);
      if (item) { item.quantity += 1; found = true; }
    } else if (type === 'customize') {
      const item = cart.customize.find(c => c._id === id);
      if (item) { item.quantity += 1; found = true; }
    }
    if (!found) return res.status(404).json({ status: 'Error', message: 'Item not found in cart' });
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Decrease quantity
router.post('/decrease', async (req, res) => {
  try {
    const { type, id } = req.body; // type: 'product' or 'customize'
    const cart = await getOrCreateCart();
    let found = false;
    if (type === 'product') {
      const item = cart.product.find(p => p._id === id);
      if (item && item.quantity > 1) { item.quantity -= 1; found = true; }
      else if (item && item.quantity === 1) { cart.product = cart.product.filter(p => p._id !== id); found = true; }
    } else if (type === 'customize') {
      const item = cart.customize.find(c => c._id === id);
      if (item && item.quantity > 1) { item.quantity -= 1; found = true; }
      else if (item && item.quantity === 1) { cart.customize = cart.customize.filter(c => c._id !== id); found = true; }
    }
    if (!found) return res.status(404).json({ status: 'Error', message: 'Item not found in cart' });
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

module.exports = router; 