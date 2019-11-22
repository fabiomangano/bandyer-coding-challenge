require('dotenv').config();
const express = require('express');
const path = require('path');
const exifParser = require('exif-parser');
const rabbitmqConnection = require('../../rabbitmq/connection');
const utils = require('../../utils');
const router = express.Router();
const Instant = require('../models/instant');
const multer = require('multer');
const fs = require('fs');

const {
  RABBITMQ_SERVER_URL,
  RESIZE_IMAGE_QUEUE_NAME,
  SERVER_URL,
} = process.env;

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
 * GET /instants route to retrieve all instants.
 */
router.get('/', (req, res) => {
  // Query the DB and if no errors, send all the instants
  let query = Instant.find({}).sort({createdAt: 'desc'});
  query.exec((err, instants) => {
    if (err) res.send(err);
    res.json(instants);
  });
});

/*
 * POST /instances to save a new instant.
 */
router.post('/', (req, res) => {
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
    const parser = exifParser.create(image);
    const exif = parser.parse(req.file.filename);

    const newInstant = new Instant({
      uploaded: path.join(SERVER_URL, PUBLIC_ORIGINAL_PHOTO_FOLDER, req.file.filename),
      name: req.body.name,
      createdBy: req.body.createdBy,
      latitude: exif.tags.GPSLatitude,
      longitude: exif.tags.GPSLongitude,
      weight: req.file.size,
    });

    newInstant.save(async(err, savedInstant) => {
      if (err) {
        return res.send(err);
      }

      const jobData = {
        id: newInstant.id,
        filename: req.file.filename,
        uploadedPath: path.join('src', UPLOADS_FOLDER, req.file.filename),
      };

      const channel = await rabbitmqConnection(
        RABBITMQ_SERVER_URL,
        RESIZE_IMAGE_QUEUE_NAME,
      );

      channel.sendToQueue(
        RESIZE_IMAGE_QUEUE_NAME,
        Buffer.from(JSON.stringify(jobData))
      );

      res.json({
        message: 'Instant successfully added!',
        savedInstant,
      });
    });
  });
});

/*
 * GET /instants/:id route to retrieve a instant given its id.
 */
router.get('/:id', (req, res) => {
  Instant.findById(req.params.id, (err, instant) => {
    if (err) res.send(err);
    res.json(instant);
  });
});

// export all the functions
module.exports = router;
