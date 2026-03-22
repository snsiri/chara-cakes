import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnection from './config/db.js'
import bodyParser from 'body-parser';
import createProxyMiddleware from 'http-proxy-middleware';

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL from the error
  credentials: true,               // Allows cookies/headers to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Import Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import ingredientRoutes from './routes/ingredientsStock.js';
import customizeRoutes from './routes/customizes.js';
import optionRoutes from './routes/options.js';
import cartRoutes from './routes/cart.js';
import discontinuedProductRoutes from './routes/discontinued_products.js';
import completedOrderRoutes from './routes/completed_orders.js';
import authCustomerRoutes from './routes/authCustomer.js';
import authStaff from './routes/authStaff.js'
import staff from './routes/staff.js'
import role from './models/role.js';
import feedback from './routes/feedback.js';


//Routes
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discontinued_product', discontinuedProductRoutes);
app.use('/api/completed_order', completedOrderRoutes);
app.use('/api/customizes',  customizeRoutes);
app.use('/api/ingredients',  ingredientRoutes); 
app.use('/api/options',   optionRoutes);
app.use('/api/cart',  cartRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth/customer',  authCustomerRoutes);
app.use('/api/auth/staff',  authStaff);
app.use('/api/staff',  staff);
app.use('/api/role',  role);
app.use('/api/feedback', feedback);

// Database connection
dbConnection();
//  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/order_management';

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Test route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




// app.listen(3000, () => {
//     console.log("API Gateway running on port 3000");
// });

