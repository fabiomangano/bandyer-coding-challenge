const mongoose = require('mongoose');

function run(url) {
  mongoose
    .connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
}

module.exports = {
  run,
};
