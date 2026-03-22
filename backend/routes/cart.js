import express from 'express';
const router = express.Router();
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Customize from '../models/Customize.js';
import { Protect } from '../middleware/authCustomer.js';
import { adminOnly} from "../middleware/authorization.js";
import Customer from '../models/Customer.js';

// Helper: get or create cart (single cart for now, _id: 'main')
async function getOrCreateCart(customerId) {


  let cart = await Cart.findOne({ customer_id: customerId });
  if (!cart) {
    cart = new Cart({ 
      _id: customerId.replace('CUS-', 'CART-'),
      customer_id: customerId,
      product: [], 
      customize: [] });
    await cart.save();
  }
  return cart;
}

// View cart
router.get('/', Protect, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.customer._id);

    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Add product to cart
router.post('/add-product', Protect, async (req, res) => {
  try {
    console.log("CUSTOMER:", req.customer);
    const { product_id, quantity = 1 } = req.body;

    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ status: 'Error', message: 'Product not found' });
    const cart = await getOrCreateCart(req.customer._id);
    const idx = cart.product.findIndex(p => p._id.toString() === product_id.toString());
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
router.post('/add-customize', Protect, async (req, res) => {
  try {
   
    const { customize_id, quantity = 1 } = req.body;
    const customize = await Customize.findById(customize_id);

    if (!customize) return res.status(404).json({ status: 'Error', message: 'Customize item not found' });
    const cart = await getOrCreateCart(req.customer._id);
    const idx = cart.customize.findIndex(c => c._id.toString() === customize_id.toString());
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
router.delete('/remove-product/:product_id', Protect, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.customer._id);

    cart.product = cart.product.filter(p => p._id.toString() !== req.params.product_id);
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Delete customize from cart
router.delete('/remove-customize/:customize_id', Protect, async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.customer._id);
    cart.customize = cart.customize.filter(c => c._id.toString() !== req.params.customize_id);
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Increase quantity
router.post('/increase', Protect, async (req, res) => {
  try {
    const { type, id } = req.body; // type: 'product' or 'customize'
    const cart = await getOrCreateCart(req.customer._id);

    let found = false;
    if (type === 'product') {
      const item = cart.product.find(p =>   p._id.toString() === id.toString());
      if (item) { item.quantity += 1; found = true; }
    } else if (type === 'customize') {
      const item = cart.customize.find(c => c._id.toString() === id.toString());
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
router.post('/decrease', Protect, async (req, res) => {
  try {
    const { type, id } = req.body; // type: 'product' or 'customize'
    const cart = await getOrCreateCart(req.customer._id);

    let found = false;
    if (type === 'product') {
      const item = cart.product.find(p => p._id.toString() === id.toString());
      if (item && item.quantity > 1) { item.quantity -= 1; found = true; }
      else if (item && item.quantity === 1) { cart.product = cart.product.filter(p => p._id !== id); found = true; }
    } else if (type === 'customize') {
      const item = cart.customize.find(c => c._id.toString() === id.toString());
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

export default router;