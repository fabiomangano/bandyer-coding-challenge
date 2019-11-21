const Jimp = require('jimp');

const {
  RESIZED_PHOTO_FOLDER,
  DEFAULT_RESIZED_WIDTH,
  DEFAULT_RESIZED_HEIGHT,
} = require('../config');

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

async function resizeImage({uploadedPath, filename}) {
  try {
    const image = await Jimp.read(uploadedPath);
    image
      .cover(DEFAULT_RESIZED_WIDTH, DEFAULT_RESIZED_HEIGHT)
      .write(`src/${RESIZED_PHOTO_FOLDER}/${filename}`);
  } catch (err) {
    throw err;
  }
}

module.exports = {
  imageFilter,
  resizeImage,
};
