const rabbitmqConnection = require('./connection');

async function sendInstantToJobQueue(url, queue, data) {
  const channel = await rabbitmqConnection(url, queue);
  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(data))
  );
}

module.exports = sendInstantToJobQueue;
