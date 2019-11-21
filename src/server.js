require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const instantsRoutes = require('./controllers/routes/instants');

const {
  SERVER_PORT,
  MONGODB_SERVER_URL,
} = process.env;

mongoose
  .connect(MONGODB_SERVER_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/', instantsRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}!`);
});

module.exports = app;
