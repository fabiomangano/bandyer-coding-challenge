require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose/init');
const instantsRoutes = require('./controllers/routes/instants');
const app = express();

const {
  SERVER_PORT,
  MONGODB_SERVER_URL,
  PUBLIC_ORIGINAL_PHOTO_FOLDER,
  UPLOADS_FOLDER,
} = process.env;

// Bootstrap Mongoose
mongoose.run(MONGODB_SERVER_URL);

// Parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Expose directory "instants" under the public folder "photos" to get saved photos
app.use(`/${PUBLIC_ORIGINAL_PHOTO_FOLDER}`, express.static(`${__dirname}/${UPLOADS_FOLDER}`));

app.use('/', instantsRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}!`);
});

module.exports = app;
