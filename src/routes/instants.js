require('dotenv').config();
const express = require('express');
const router = express.Router();

const {
  getInstants,
  postInstant,
  getInstant,
} = require('./controllers');

router.get('/', getInstants);
router.post('/', postInstant);
router.get('/:id', getInstant);

module.exports = router;
