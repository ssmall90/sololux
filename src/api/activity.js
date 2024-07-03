const mongoose = require('mongoose');

const Activity = mongoose.models.activities || mongoose.model('activities', new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  type: String,
  rating: Number,
  photos: [String],
  city: String,
  country: String,
  place_id: { type: String } 
}));

module.exports = Activity;
