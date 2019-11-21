let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Instant schema definition
let InstantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  },
});

// Sets the createdAt parameter equal to the current time
InstantSchema.pre('save', next => {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Exports the InstantSchema for use elsewhere.
module.exports = mongoose.model('instant', InstantSchema);