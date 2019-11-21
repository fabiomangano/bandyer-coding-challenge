const Instant = require('../models/instant');
const multer = require('multer');

const {
  PUBLIC_ORIGINAL_PHOTO_FOLDER,
  UPLOADS_FOLDER,
} = require('../../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('src', UPLOADS_FOLDER));
  },
  filename: (req, file, cb) => {
    cb(null, `photo-${Date.now()}${path.extname(file.originalname)}`);
  },
});

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
  const upload = multer({ storage: storage, fileFilter: utils.imageFilter }).single('file');

  upload(req, res, (err) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      res.status(400);
      return res.send({message: 'Please select an image to upload'});
    } else if (err instanceof multer.MulterError) {
      res.status(500);
      return res.send(err);
    } else if (err) {
      res.status(500);
      return res.send(err);
    }
  
    const image = fs.readFileSync(path.join('src', UPLOADS_FOLDER, req.file.filename));

    const newInstant = new Instant({
      uploaded: path.join(SERVER_URL, PUBLIC_ORIGINAL_PHOTO_FOLDER, req.file.filename),
      name: req.body.name,
      createdBy: req.body.createdBy,
      weight: req.file.size, 
    });
  
    newInstant.save(async(err, savedInstant) => {
      if (err) {
        return res.send(err);
      }
      //@TODO: resizeImage task

      res.status(200).json({
        message: 'Instant successfully added!',
        savedInstant
      });
    })  
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