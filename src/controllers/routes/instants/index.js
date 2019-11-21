const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/:id', controllers.getInstant);
router.get('/', controllers.getInstants);
router.post('/', controllers.postInstant);

module.exports = router;
