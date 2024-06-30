const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  image: { type: String },
  postalCode: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
