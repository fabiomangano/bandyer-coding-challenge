require('dotenv').config();
const path = require('path');
const util = require('util');
const Instant = require('../models/instant');
const exifParser = require('exif-parser');
const multer = require('multer');
const fs = require('fs');
const sendInstantToJobQueue = require('../rabbitmq/sendInstantToJobQueue');
const utils = require('../utils');

const {
  RABBITMQ_SERVER_URL,
  RESIZE_IMAGE_QUEUE_NAME,
  SERVER_URL,
} = process.env;

const {
  PUBLIC_ORIGINAL_PHOTO_FOLDER,
  UPLOADS_FOLDER,
} = require('../config');


// Uploader config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('src', UPLOADS_FOLDER));
  },
  filename: (req, file, cb) => {
    cb(null, `photo-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = util.promisify(multer({
  storage,
  fileFilter: utils.imageFilter,
}).single('file'));

async function getInstants(req, res) {
  // Query the DB and if no errors, send all the instants
  try {
    const instants = await Instant.find({}).exec();
    res.json(instants);
  } catch (err) {
    res.send(err);
  }
}

async function getInstant(req, res) {
  if (!req.params.id) {
    res
      .status(400)
      .send(new Error('Instant id not provided.'));
  }

  try {
    const instants = await Instant.findById(req.params.id);
    res.json(instants);
  } catch (err) {
    res.send(err);
  }
}

async function postInstant(req, res) {
  try {
    await upload(req, res);
    const {file, body} = req;
    const image = fs.readFileSync(path.join('src', UPLOADS_FOLDER, file.filename));
    const parser = exifParser.create(image);
    const exif = parser.parse(file.filename);

    const newInstant = new Instant({
      uploaded: path.join(SERVER_URL, PUBLIC_ORIGINAL_PHOTO_FOLDER, file.filename),
      name: body.name,
      createdBy: body.createdBy,
      latitude: exif.tags.GPSLatitude,
      longitude: exif.tags.GPSLongitude,
      weight: file.size,
    });

    const savedInstant = await newInstant.save();

    const jobData = {
      id: savedInstant.id,
      filename: file.filename,
      uploadedPath: path.join('src', UPLOADS_FOLDER, file.filename),
    };

    await sendInstantToJobQueue(RABBITMQ_SERVER_URL, RESIZE_IMAGE_QUEUE_NAME, jobData);

    res.json({
      message: 'Instant successfully added!',
      savedInstant,
    });
  } catch (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      res.status(400);
      return res.send({message: 'Please select an image to upload'});
    } else if (err) {
      res.status(500);
      return res.send(err);
    }
  }
}

module.exports = {
  getInstants,
  getInstant,
  postInstant,
};
