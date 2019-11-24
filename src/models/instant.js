const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {INSTANT_STATUS} = require('../config');

// Instant schema definition
// @TODO bisogna salvare anche i campi di quella resized
const InstantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    uploaded: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: INSTANT_STATUS.PENDING,
    },
  }
);

// Sets the createdAt parameter equal to the current time
InstantSchema.pre('save', next => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// Exports the InstantSchema for use elsewhere.
module.exports = mongoose.model('instant', InstantSchema);
