const redisClient = require('./redisClient');
const shortid = require('shortid');

const radius = 50;


function initSocket(io) {
  io.on('connection', function(socket) {
    console.log('user connected');

    let latitude = 1;
    let longitude = 2;
    let channelId = null;
    let userId = null;

    redisClient.getChannel(latitude, longitude, radius)
    .then((channel) => {
      channelId = channel.channelId;
      return channelId;
    }, (error) => {
      channelId = shortid.generate();
      return channelId;
    })
    .then((channelId) => {
      socket.join(channelId);

      userId = shortid.generate();
      return redisClient.addUser(userId, channelId);
    })
    .then((result) => {
      return redisClient.getMessages(channelId, 10);
    })
    .then((messages) => {
      // emit the messages here

      socket.on('message', data => {
        redisClient.addMessage(channelId, data.message, userId);
      });

    })
    .catch((error) => {
      // hehe xd
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    
  });
}

module.exports.initSocket = initSocket;