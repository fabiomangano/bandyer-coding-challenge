const createConnection = require('./connection');
const Instant = require('../controllers/models/instant');
const {
  PUBLIC_PHOTO_FOLDER,
  INSTANT_STATUS,
  DEFAULT_RESIZED_WIDTH,
  DEFAULT_RESIZED_HEIGHT,
} = require('../config');
const {
  resizeImage,
} = require('../utils');

function savePhotoInstant({serverUrl, id, filename}) {
  return new Promise((resolve, reject) => {
    Instant.findById(id, (err, instant) => {
      if (err) {
        reject(err);
      };
      instant.url = `${serverUrl}/${PUBLIC_PHOTO_FOLDER}/${filename}`;
      instant.status = INSTANT_STATUS.DONE;
      instant.height = DEFAULT_RESIZED_HEIGHT;
      instant.width = DEFAULT_RESIZED_WIDTH;
      instant.save((err, savedInstant) => {
        if (err) {
          reject(err);
        };
        resolve(savedInstant);
      });
    });
  });
}

function createPhotoInstant(serverUrl, channel) {
  return async function(msg) {
    channel.prefetch(1);
    try {
      const {id, uploadedPath, filename} = JSON.parse(msg.content.toString());
      await resizeImage({uploadedPath, filename});
      await savePhotoInstant({serverUrl, id, filename});
    } catch (err) {
      throw err;
    }
    channel.ack(msg);
  };
}

async function run(RMQUrl, queueName, serverUrl) {
  try {
    const channel = await createConnection(
      RMQUrl,
      queueName
    );

    channel.consume(
      queueName,
      createPhotoInstant(serverUrl, channel)
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  run,
};
