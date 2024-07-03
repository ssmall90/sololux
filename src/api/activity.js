const mongoose = require("mongoose");

// Schema for the activities
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  website: { type: String, required: true },
  type: String,
  rating: Number,
  photos: [String],
  city: String,
  country: String,
  place_id: { type: String } 
});

// Add a compound index on place_id to ensure uniqueness
activitySchema.index({ place_id: 1 }, { unique: true });

// Create and return the model for the activities collection
const Activity = mongoose.model('activities', activitySchema);

module.exports = Activity;