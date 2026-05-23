const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token!' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized!' });
    }
  });
};

// CREATE order — stock decrements automatically
router.post('/', verifyToken, async (req, res) => {
  try {
    // Check stock and decrement for each product
    for (const item of req.body.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found!` });
      }
      if (product.stock < 1) {
        return res.status(400).json({ message: `${product.name} is out of stock!` });
      }
      // Decrement stock by 1
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -1 }
      });
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      products: req.body.products,
      totalPrice: req.body.totalPrice
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all orders (admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user's own orders
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE order status (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;