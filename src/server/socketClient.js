const messageService = require('./service/messageService');
const userService = require('./service/userService');
const channelService = require('./service/channelService');
const shortid = require('shortid');

const radius = 50;

function initSocket(io) {

  io.on('connection', function(socket) {
    console.log('user connected');

    let latitude = 1;
    let longitude = 2;
    let channelId = null;
    let userId = null;

    channelService.getChannel(latitude, longitude, radius)
    .then((channel) => {
      if (channel) {
        channelId = channel.key;
        return Promise.resolve(channelId);
      }
    }, (error) => {
        channelId = shortid.generate();
        return channelService.createChannel(channelId, latitude, longitude);
    })
    .then((channelId) => {
      socket.join(channelId);

      userId = shortid.generate();
      return userService.addUser(userId, channelId);
    })
    .then((result) => {
      return messageService.getMessages(channelId, 10);
    })
    .then((messages) => {
      // emit the messages here
      console.log('messages: ' + messages);

      socket.on('addMessage', data => {
        console.log('in the message handler: ' + data.message);
        messageService.addMessage(channelId, data.message, userId);
        socket.broadcast.to(channelId).emit('broadcastMessage', data);
      });

    })
    .catch((error) => {
      console.log(error);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    
  });
}

module.exports.initSocket = initSocket;