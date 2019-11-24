const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {INSTANT_STATUS} = require('../config');

let InstantSchema = null;

// Instant schema definition
const instantSchema = new Schema(
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
instantSchema.pre('save', next => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

// to avoid OverwriteModelError
// https://github.com/kriasoft/react-starter-kit/issues/1418
try {
  InstantSchema = mongoose.model('instant', instantSchema);
} catch (e) {
  InstantSchema = mongoose.model('instant');
}

// Exports the InstantSchema for use elsewhere.
module.exports = InstantSchema;
