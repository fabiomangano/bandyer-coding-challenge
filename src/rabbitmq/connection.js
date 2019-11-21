const amqp = require('amqplib');

function connect(url) {
  return new Promise((resolve, reject) => {
    amqp.connect(url)
      .then(conn => resolve(conn))
      .catch(err => reject(err));
  });
}

function createChannel(conn) {
  return new Promise((resolve, reject) => {
    conn.createChannel()
      .then(channel => resolve(channel))
      .catch(err => reject(err));
  });
}

function channelAssertQueue(channel, queueName) {
  return new Promise((resolve, reject) => {
    channel.assertQueue(queueName)
      .then(() => resolve(channel))
      .catch(err => reject(err));
  });
}

async function connection(url, queueName) {
  let channel;
  try {
    const conn = await connect(url);
    channel = await createChannel(conn);
    await channelAssertQueue(channel, queueName);
  } catch (err) {
    throw new Error(err);
  }

  return channel;
}

module.exports = connection;
