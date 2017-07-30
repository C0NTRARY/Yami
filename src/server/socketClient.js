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
        channelId = channel.channelId;
      } else {
        channelId = shortid.generate();
      }
      return channelId;
    })
    .then((channelId) => {
      socket.join(channelId);

      userId = shortid.generate();
      console.log(userId + 'is in channel' + channelId);
      return userService.addUser(userId, channelId);
    })
    .then((result) => {
      return messageService.getMessages(channelId, 10);
    })
    .then((messages) => {
      // emit the messages here

      socket.on('message', data => {
        messageService.addMessage(channelId, data.message, userId);
        io.to(channelId).broadcast.emit('broadcastMessage', data);
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