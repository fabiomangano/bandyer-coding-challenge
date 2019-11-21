const express = require('express');
const mongoose = require('mongoose');
const app = express();
const instantsRoutes = require('./controllers/routes/instants');
const PORT = 3000;

mongoose
  .connect(
    'mongodb://mongo:27017/expressmongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  
app.use('/', instantsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});

module.exports = app;