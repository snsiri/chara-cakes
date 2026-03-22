import express from 'express';
const router = express.Router();
import Feedback from '../models/Feedback.js';
import Completed_order from '../models/Completed_order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { Protect } from '../middleware/authCustomer.js';
import { adminOnly } from '../middleware/authorization.js';
import getNextSequenceValues from '../utils/sequences.js';
const prefix = "FB-";

// --- ADD FEEDBACK ---
router.post('/add', Protect, async (req, res) => {
    try {
        const { product_id, order_id,rating, comment } = req.body;
        const customer_id = req.customer._id; // From token
        const customerName = req.customer.name; 

        // CHECK: Has the customer purchased this product?
        const hasOrdered = await Completed_order.findOne({
            _id:order_id,
            customer_id: customer_id,
            product: { $elemMatch: { _id: product_id } }
            
        });

        if (!hasOrdered) {
            return res.status(403).json({ 
                message: "You can only review products you have purchased and received." 
            });
        }

        const alreadyReviewed = await Feedback.findOne({
            customer_id,
            product_id,
            order_id: hasOrdered._id
            });

            if (alreadyReviewed) {
            return res.status(400).json({ message: "You already reviewed this product." });
        }


        const sequenceName = "feedbackid";
        const newId = await getNextSequenceValues(prefix, sequenceName);

        const feedback = await Feedback.create({
            _id: newId,
            product_id,
            customer_id: customer_id,
            order_id: hasOrdered._id,
            customer_name: customerName,
            rating,
            feedback_text:comment
        });

        res.status(201).json({ status: "Success", data: feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET BY PRODUCT (Public) ---
router.get('/product/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;

    const feedbacks = await Feedback.find({ product_id: productId })
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// --- UPDATE---
router.put('/update/:id', Protect, async (req, res) => {
    try {
        const feedback = await Feedback.findOneAndUpdate(
            { _id: req.params.id, customer_id: req.customer._id },
            { rating: req.body.rating, comment: req.body.comment },
            { new: true }
            
        );
        res.status(200).json({ status: "Feedback Updated." });
        if (!feedback) return res.status(404).json({ message: "Feedback not found or unauthorized" });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//--- DELETE FEEDBACK ---
router.put('/delete/:id', Protect, async (req, res) => {
    try {
        const feedback = await Feedback.findOneAndDelete(
            { _id: req.params.id, customer_id: req.customer._id },
            { new: true }
        );
        res.status(200).json({ status: "Feedback Deleted!" });
        if (!feedback) return res.status(404).json({ message: "Feedback not found or unauthorized" });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN: HIDE FEEDBACK ---
router.patch('/hide/:id', Protect, adminOnly, async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { isHidden: req.body.isHidden },
            { new: true }
        );
        res.json({ message: "Feedback visibility updated", feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET ALL FEEDBACKS FOR THE LOGGED-IN CUSTOMER ---
router.get('/my-feedbacks', Protect, async (req, res) => {
    try {
        // Use req.customer._id from the token to ensure privacy
        const customer_id = req.customer._id;

        // Find all feedbacks, sort by newest first, and optionally populate product details
        const feedbacks = await Feedback.find({ customer_id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "Success",
            count: feedbacks.length,
            data: feedbacks
        });
    } catch (err) {
        res.status(500).json({ 
            status: "Error", 
            message: "Failed to fetch your feedbacks", 
            error: err.message 
        });
    }
});

// Verification route: Is this customer allowed to review this product?
// 

router.get('/verify-purchase/:pid', Protect, async (req, res) => {
  try {
    const customerId = req.customer._id.toString();
    const productId = req.params.pid.toString();

    // 1. Find ALL completed orders containing this product for this customer
    const orders = await Completed_order.find({
      customer_id: customerId,
      product: { $elemMatch: { _id: productId } }
    });

    if (!orders || orders.length === 0) {
      return res.json({ eligible: false, reason: "No purchase found" });
    }

    // 2. Check each order to find one that hasn't been reviewed yet
    for (const order of orders) {
      const alreadyReviewed = await Feedback.findOne({
        customer_id: customerId,
        product_id: productId,
        order_id: order._id // use the current order in the loop
      });

      // If we find an order that HAS NOT been reviewed, the user is eligible
      if (!alreadyReviewed) {
        return res.json({ eligible: true, order_id: order._id });
      }
    }

    // 3. If the loop finishes, it means all matching orders were already reviewed
    res.json({ eligible: false, reason: "Already reviewed all purchases" });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;