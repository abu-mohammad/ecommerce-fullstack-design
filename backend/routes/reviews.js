const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');

// Verify token middleware
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

// GET all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a review
router.post('/:productId', verifyToken, async (req, res) => {
  try {
    // Check if user already reviewed
    const existing = await Review.findOne({
      product: req.params.productId,
      user: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product!' });
    }

    const review = new Review({
      product: req.params.productId,
      user: req.user.id,
      userName: req.body.userName,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;