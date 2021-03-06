const messageService = require('./service/messageService');
const userService = require('./service/userService');
const channelService = require('./service/channelService');
const shortid = require('shortid');

const radius = 50;

function initSocket(io) {

  io.on('connection', function(socket) {
    console.log('user connected');

    socket.on('sendGeolocation', position => {
      addUserToChannel(position, socket);
    });
  });
}

function addUserToChannel(position, socket) {
    let latitude = position.latitude;
    let longitude = position.longitude;
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
      socket.emit('previousMessages', messages.reverse());

      socket.on('addMessage', data => {
        messageService.addMessage(channelId, data.message, userId);
        socket.broadcast.to(channelId).emit('broadcastMessage', data);
      });

      socket.on('disconnect', () => {
        console.log('user ' + userId + ' disconnected');
        userService.removeUser(userId, channelId)
        .then((result) => {
          // check if channel is empty
          userService.getUsers(channelId)
          .then((items) => {
            cleanupChannel(channelId, items);
          });
        });
      });

    })
    .catch((error) => {
      console.log(error);
    });
}

function cleanupChannel(channelId, items) {
  if(items.length == 0) {
    channelService.deleteChannel(channelId)
      .then(() => {
        console.log('Channel ' + channelId + ' has been deleted');
      })
      .catch((err) => {
        console.log('Channel ' + channelId + ' deletion has failed with error message: ' + err);
      })
  }
}

module.exports.initSocket = initSocket;