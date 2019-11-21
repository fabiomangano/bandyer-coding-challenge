const express = require('express');
const router = express.Router();
const controllers = require('./controllers')

router.get('/api/v1/instants/:id', controllers.getInstant);
router.get('/api/v1/instants', controllers.getInstants);
router.post('/api/v1/instants', controllers.postInstant);

module.exports = router;