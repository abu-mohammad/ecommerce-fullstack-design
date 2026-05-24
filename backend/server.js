const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

try { require('dotenv').config(); } catch(e) {}

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin:admin1234@cluster0.argwnpp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'shopeasy_secret_key_2026';
console.log('PORT:', PORT);
console.log('MONGO_URI exists:', !!MONGO_URI);

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined!');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Connection failed!', error);
  });