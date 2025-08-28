const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const getNextSequenceValue = require("../utils/sequence");
const prefix = "ORD-";
const Product = require("../models/Product");
const Cart = require('../models/Cart');
const Customize = require('../models/Customize');

// Get all orders
router.get('/get', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('product._id')
      .populate('customize._id');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ 
      error: 'Failed to fetch orders', 
      message: err.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found', 
        message: 'The order you are trying to update does not exist' 
      });
    }
    
    // Validate required fields
    const { customer_id, product, customize, status } = req.body;
    if (!customer_id) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Customer ID is required' 
      });
    }

    // Update order
    order.customer_id = customer_id;
    if (product) order.product = product;
    if (customize) order.customize = customize;
    if (status) order.status = status;
    if (req.body.isDelivered !== undefined) order.isDelivered = req.body.isDelivered;
    order.updatedAt = new Date();

    const updatedOrder = await order.save();
    res.json({ 
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ 
      error: 'Failed to update order', 
      message: err.message 
    });
  }
});
router.put('/:id/deliver', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ 
          error: 'Order not found', 
          message: 'The order you are trying to update does not exist' 
        });
      }
      
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.updatedAt = new Date();
      
      const updatedOrder = await order.save();
      res.json({ 
        message: 'Order marked as delivered successfully',
        order: updatedOrder
      });
    } catch (err) {
      console.error('Error updating delivery status:', err);
      res.status(500).json({ 
        error: 'Failed to update delivery status', 
        message: err.message 
      });
    }
  });
router.post('/add', async (req, res) => {
  // Add delivery status update route
  
  try {
    const { customer_id, selectedProducts = [], selectedCustomizes = [], ...rest } = req.body;
    const cart = await Cart.findById('main');
    if (!cart) return res.status(400).json({ error: "Cart not found" });

    // Filter selected products and customizes from the cart
    const productsToOrder = cart.product.filter(p => selectedProducts.includes(p._id));
    const customizesToOrder = cart.customize.filter(c => selectedCustomizes.includes(c._id));

    if (productsToOrder.length === 0 && customizesToOrder.length === 0) {
      return res.status(400).json({ error: "No items selected for checkout" });
    }

    // --- Gather all ingredients ---
    const ProductModel = require('../models/Product');
    const CustomizeModel = require('../models/Customize');
    let allIngredients = [];

    // Get ingredients from products
    for (const p of productsToOrder) {
      const prod = await ProductModel.findById(p._id);
      if (prod && prod.ingredients) {
        prod.ingredients.forEach(ing => {
          allIngredients.push({
            _id: ing._id,
            name: ing.name,
            quantity: ing.quantity * p.quantity,
            unit: ing.unit
          });
        });
      }
    }

    // Get ingredients from customizes
    for (const c of customizesToOrder) {
      const cust = await CustomizeModel.findById(c._id);
      if (cust && cust.custom_ingredients) {
        cust.custom_ingredients.forEach(ing => {
          allIngredients.push({
            _id: ing._id,
            name: ing.name,
            quantity: ing.quantity * c.quantity,
            unit: ing.unit
          });
        });
      }
    }

    // --- Merge and sum ingredient quantities ---
    const mergedIngredients = {};
    allIngredients.forEach(ing => {
      if (!ing) return;
      const key = ing._id;
      if (mergedIngredients[key]) {
        mergedIngredients[key].quantity += ing.quantity;
      } else {
        mergedIngredients[key] = { ...ing };
      }
    });

    const ingredientsArray = Object.values(mergedIngredients);

    // --- Create the order ---
    const newId = await getNextSequenceValue(prefix, "orderid");
    const newOrder = new Order({
      _id: newId,
      customer_id,
      product: productsToOrder,
      customize: customizesToOrder,
      ingredients: ingredientsArray,
      ...rest,
      createdAt: new Date()
    });
    await newOrder.save();

    // Remove checked out items from the cart
    cart.product = cart.product.filter(p => !selectedProducts.includes(p._id));
    cart.customize = cart.customize.filter(c => !selectedCustomizes.includes(c._id));
    await cart.save();

    res.status(201).json({ status: "Order placed successfully.", order: newOrder });
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).json({ 
      error: 'Failed to create order', 
      message: err.message 
    });
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
    console.error('Error adding product to cart:', error);
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

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
        custom_ingredients: customize.custom_ingredients,
        quantity,
        added_date: new Date()
      });
    }
    await cart.save();
    res.json({ status: 'Success', data: cart });
  } catch (error) {
    console.error('Error adding customization to cart:', error);
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

http://localhost:4000/api/order/completed/crntpdct

router.route("/completed/:order_id").delete(async (req, res) => {
    try {
        const _id = req.params.order_id;

        const completed  = await Order.findById(_id);
        if (!completed) {
            return res.status(404).json({ status: "Order not found" });
        }

        const completed_order = new Completed_order({
            _id: completed._id,
        
            //customer_id:completed._id,
            products:completed.products,
            customize:completed.customize,
            deliveryAddress:completed.deliveryAddress,
            paymentMethod:completed.paymentMethod,
            itemsPrice:completed.itemsPrice,
            deliveryfee:completed.deliveryfee,
            taxPrice:completed.taxPrice,
            totalPrice:completed.totalPrice,
            isPaid: completed.isPaid,
            paidAt:completed.paidAt,
            deliveredAt: new Date(),
        });

        await completed_order.save();
        await Order.findByIdAndDelete(_id);

        res.status(200).json({ status: "Order deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error deleting order", error: err.message });
    }
});

module.exports = router;