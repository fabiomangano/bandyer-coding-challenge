require('dotenv').config();

const createApp = require('./createApp');

const {
  SERVER_PORT,
  MONGODB_SERVER_URL,
  RABBITMQ_SERVER_URL,
  RESIZE_IMAGE_QUEUE_NAME,
  SERVER_URL,
} = process.env;

const app = createApp(
  MONGODB_SERVER_URL,
  RABBITMQ_SERVER_URL,
  RESIZE_IMAGE_QUEUE_NAME,
  SERVER_URL
);

const PORT = SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
