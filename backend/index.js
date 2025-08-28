const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { createProxyMiddleware } = require("http-proxy-middleware");
app.use(express.json());


// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const discontinuedProductsRouter = require('./routes/discontinued_products');
const completedOrdersRouter = require('./routes/completed_orders');
const customizesRouter = require('./routes/customizes');
const ingredientRouter = require('./routes/ingredients');
const optionsRouter = require('./routes/options');
const cartRouter = require('./routes/cart');
const dbConnection = require('./config/db');

app.use('/api/product', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/discontinued_product', discontinuedProductsRouter);
app.use('/api/completed_order', completedOrdersRouter);
app.use('/api/customizes', customizesRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/options', optionsRouter);
app.use('/api/cart', cartRouter);
app.use('/uploads', express.static('uploads'));

// Database connection
dbConnection();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/order_management';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test route
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

module.exports = app;