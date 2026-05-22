const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/200'
  },
  stock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);