import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dbConnection from './config/db.js';
import bodyParser from 'body-parser';

// 1. ALWAYS load environment variables first!
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Good to have for forms
app.use('/uploads', express.static('uploads'));

// 3. Import Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import ingredientRoutes from './routes/ingredientsStock.js';
import customizeRoutes from './routes/customizes.js';
import optionRoutes from './routes/options.js';
import cartRoutes from './routes/cart.js';
import discontinuedProductRoutes from './routes/discontinued_products.js';
import completedOrderRoutes from './routes/completed_orders.js';
import authCustomerRoutes from './routes/authCustomer.js';
import authStaff from './routes/authStaff.js';
import staff from './routes/staff.js';
import role from './routes/role.js';
import feedback from './routes/feedback.js';

// 4. Bind Routes to Express
app.use('/api/product', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discontinued_product', discontinuedProductRoutes);
app.use('/api/completed_order', completedOrderRoutes);
app.use('/api/customizes', customizeRoutes);
app.use('/api/ingredients', ingredientRoutes); 
app.use('/api/options', optionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth/customer', authCustomerRoutes);
app.use('/api/auth/staff', authStaff);
app.use('/api/staff', staff);
app.use('/api/role', role);
app.use('/api/feedback', feedback);

// 5. Root Test Route
app.get('/', (req, res) => {
    res.send('API is running successfully!');
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

// 7. Establish DB Connection AND then boot the Server!
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Relying on your external config/db.js to handle mongoose.connect()
    await dbConnection(); 
    console.log("✅ Database Setup Finished.");

    app.listen(PORT, () => {
      console.log(`🚀 API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ App failed to boot:", error.message);
    process.exit(1);
  }
};

startServer();