const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
  {
    name: "Wireless Headphones",
    price: 29.99,
    description: "High quality wireless headphones with noise cancellation and 20hr battery life.",
    category: "Electronics",
    image: "https://via.placeholder.com/200",
    stock: 50
  },
  {
    name: "Running Shoes",
    price: 49.99,
    description: "Lightweight and comfortable running shoes perfect for daily training.",
    category: "Sports",
    image: "https://via.placeholder.com/200",
    stock: 30
  },
  {
    name: "Coffee Mug",
    price: 19.99,
    description: "Large ceramic coffee mug that keeps your drink warm for hours.",
    category: "Kitchen",
    image: "https://via.placeholder.com/200",
    stock: 100
  },
  {
    name: "Laptop Bag",
    price: 39.99,
    description: "Waterproof laptop bag with multiple compartments fits up to 15 inch laptops.",
    category: "Electronics",
    image: "https://via.placeholder.com/200",
    stock: 25
  },
  {
    name: "Yoga Mat",
    price: 24.99,
    description: "Non-slip yoga mat with carrying strap, perfect for home or gym workouts.",
    category: "Sports",
    image: "https://via.placeholder.com/200",
    stock: 40
  },
  {
    name: "Water Bottle",
    price: 14.99,
    description: "Stainless steel water bottle keeps drinks cold for 24hrs and hot for 12hrs.",
    category: "Kitchen",
    image: "https://via.placeholder.com/200",
    stock: 75
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected!');
    await Product.deleteMany();
    console.log('Old products deleted!');
    await Product.insertMany(products);
    console.log('Sample products added successfully!');
    process.exit();
  })
  .catch((error) => {
    console.log('Error:', error);
    process.exit(1);
  });