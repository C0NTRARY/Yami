const redisClient = require('./redisClient');
const shortid = require('shortid');

const radius = 50;


function initSocket(io) {
  io.on('connection', function(socket) {
    let latitude = 1;
    let longitude = 2;
    let channelId = null;

    redisClient.getChannel(latitude, longitude, radius)
    .then((channel) => {
      channelId = channel.channelId;
    })
    .catch((error) => {
      channelId = shortid.generate();
      redisClient.createChannel(channelId, latitude, longitude);
    });

    socket.join(channelId);

    let userId = shortid.generate();
    redisClient.addUser(userId, channelId);

    redisClient.getMessages(channelId, 10)
    .then((messages) => {
      // emit the messages here
    })
    .catch((error) => {
      // can't emit any messages here
    })

    console.log('a user connected');

    socket.on('message', data => {
      console.log('message: ' + data.message);

      redisClient.addMessage

      redisClient.lpush("chatMessages", data.message, redis.print);

      redisClient.lrange('chatMessages', 0, -1, function (error, items) {
        if (items) {
          items.forEach(function (item) {
            console.log(item);
          });
        }

      });

    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    
  });
}

module.exports.initSocket = initSocket;