require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./mongoose/init');
const instantsRoutes = require('./controllers/routes/instants');
const app = express();

const {
  SERVER_PORT,
  MONGODB_SERVER_URL,
} = process.env;

// Bootstrap Mongoose
mongoose.run(MONGODB_SERVER_URL);

// Parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', instantsRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}!`);
});

module.exports = app;
