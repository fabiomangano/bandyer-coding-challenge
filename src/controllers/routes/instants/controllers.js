/*
GET /instants route to retrieve all instants.
 */
function getInstants(req, res) {
  res.status(200).json({
    message: "All the instants",
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
  res.status(200).json({
    message: 'your instant',
    req: req.body.ciao,
  });
}

//export all the functions
module.exports = {
  getInstants,
  postInstant,
  getInstant,
};