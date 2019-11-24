const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const {
  PUBLIC_PHOTO_FOLDER,
  RESIZED_PHOTO_FOLDER,
  PUBLIC_ORIGINAL_PHOTO_FOLDER,
  UPLOADS_FOLDER,
} = require('./config');

const mongoose = require('./mongoose/init');
const RMQConsumer = require('./rabbitmq/client');
const instantsRouter = require('./routes/instants');

function createApp(
  MONGODB_SERVER_URL,
  RABBITMQ_SERVER_URL,
  RESIZE_IMAGE_QUEUE_NAME,
  SERVER_URL,
) {
  // Bootstrap Mongoose and the rabbitmq client
  mongoose.run(MONGODB_SERVER_URL);
  RMQConsumer.run(RABBITMQ_SERVER_URL, RESIZE_IMAGE_QUEUE_NAME, SERVER_URL);

  // Parse application/json and look for raw text
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Expose directory "instants" under the public folder "photos" to get saved photos
  app.use(`/${PUBLIC_PHOTO_FOLDER}`, express.static(`${__dirname}/${RESIZED_PHOTO_FOLDER}`));
  app.use(`/${PUBLIC_ORIGINAL_PHOTO_FOLDER}`, express.static(`${__dirname}/${UPLOADS_FOLDER}`));

  // Use instants routes on app
  app.use('/api/v1/instants', instantsRouter);

  return app;
}

module.exports = createApp;
