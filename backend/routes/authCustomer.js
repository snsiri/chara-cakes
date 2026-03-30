import express from 'express';
import Customer from '../models/Customer.js';
import getNextSequenceValues from '../utils/sequences.js';
const prefix="CUS-";
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Protect } from '../middleware/authCustomer.js';
import Cart from '../models/Cart.js';


const router = express.Router();

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {// only our website can decode the token 
        expiresIn: '7d',//expires in 30 days
    });

};

//Register
router.post('/register', async (req, res) => {
    const { name, birthdate, address, phone, email, image, password, confirmPassword } = req.body;
    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        //Password match check
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Password strength check
        if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
        }

        //check existing customers
        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res
            .status(400)
            .json({ message: 'Customer with this email already exists.' });
        }
        // Create a new customer with generated _id + request body
        const sequenceName = "customerid";
        const newId = await getNextSequenceValues(prefix, sequenceName);
        const customer = await Customer.create({
            _id: newId,
            name, 
            birthdate, 
            address, 
            phone, 
            email, 
            image, 
            password
        });

        // 2. CREATE THE CART (Check if customer was actually created)
        
        if (customer) {
            const cartId = newId.replace('CUS-', 'CART-');
            try {
                await Cart.create({
                    _id:cartId,
                    customer_id: customer._id, // Ensure this matches your Cart Schema type (String vs ObjectId)
                    product: [],
                    customize: []
                });
            } catch (cartError) {
                console.error("Cart creation failed:", cartError.message);
                // Optional: If cart fails, you might want to delete the customer 
                // to prevent "orphan" customers without carts.
                
                return res.status(500).json({ message: "Failed to initialize account cart. Please try again." });
            }
        }

        const token = generateToken(customer._id);
        res.status(201).json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            token,
        });
    
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res
            .status(400)
            .json({ message: 'Please provide all required fields.' });
        }
        const customer = await Customer.findOne({ email });
        if (!customer ||!(await customer.matchPassword(password))) {
            return res 
                .status(401)
                .json({message: 'Invalid credentials.'});
        }else{
            
            res.status(200).json({
                token: generateToken(customer._id),
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    email: customer.email,
           
            },
            });
        }
        } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

});

//Update Details
router.put('/update', Protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });

    const { name, email, phone, address, birthdate, gender } = req.body;

    // If email is being changed, make sure it's not taken by another account
    if (email && email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: 'Email is already in use by another account.' });
      customer.email = email;
    }

    if (name)      customer.name      = name;
    if (phone)     customer.phone     = phone;
    if (address)   customer.address   = address;
    if (birthdate) customer.birthdate = birthdate;
    if (gender)    customer.gender    = gender;

    customer.last_updated_At = new Date();
    await customer.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      customer: {
        _id:       customer._id,
        name:      customer.name,
        email:     customer.email,
        phone:     customer.phone,
        address:   customer.address,
        birthdate: customer.birthdate,
        gender:    customer.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


//update password  (protected)

router.put('/update-password', Protect, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword)
      return res.status(400).json({ message: 'Please provide all password fields.' });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: 'New passwords do not match.' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });

    // Need to fetch with password for comparison
    const customer = await Customer.findById(req.customer._id).select('+password');
    if (!customer)
      return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await customer.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect.' });

    customer.password = newPassword; // pre-save hook will hash it
    customer.last_updated_At = new Date();
    await customer.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
//Me
router.get('/me', Protect, async (req, res) => {
    try {
        // Use the data already fetched by the Protect middleware
        if (!req.customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // req.customer already has the password excluded from the middleware
        res.json(req.customer);
  } catch (error) {
    res.status(500).json({ message: "Server error in authcustomer:me" });
  }
});

export default router;