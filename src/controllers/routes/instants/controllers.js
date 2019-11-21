const Instant = require('../models/instant');
/*
GET /instants route to retrieve all instants.
 */
function getInstants(req, res) {
  // Query the DB and if no errors, send all the instants
  Instant.find({}).exec((err, instants) => {
    if (err) res.send(err);
    res.json(instants);
  });
}

/*
 * POST /instances to save a new instant.
 */
function postInstant(req, res) {
  res.status(200).json({
    message: 'instant created'
  });
}

/*
 * GET /instants/:id route to retrieve a instant given its id.
 */
function getInstant(req, res) {
  Instant.findById(req.params.id, (err, instant) => {
    if (err) res.send(err);
    res.json(instant);
  });
}

//export all the functions
module.exports = {
  getInstants,
  postInstant,
  getInstant,
};