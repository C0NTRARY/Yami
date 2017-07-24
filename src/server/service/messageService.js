const redis = require('redis');
const redisClient = redis.createClient();
const geo = require('georedis').initialize(redisClient, {
    zset: 'Channels'
});

redisClient.once('ready', function() {
  console.log('redis client up');
});

/**
 * Redis table name format:
 *  [channelId]Users = ('userId1', 'userId2', ...)
 *  [channelId]Messages = ['message1', 'message2', ...]
 *  Channels = ('channelId': {<latitude>, <longitude>}, ...)
 */

/**
 * 
 * @param {*} channelId 
 * @param {*} numMessages 
 */
function getMessages(channelId, numMessages) {

  return new Promise((resolve, reject) => {

    redisClient.lrange(channelId+'Messages', 0, numMessages, (error, items) => {

      if (error) {
        reject(error);

      } else {

        let messages = [];

        if (items) {
          items.forEach(function (item) {
            messages.push(item);
          });
        }
        
        resolve(messages);
      }
    });
  });
}

function addMessage(channelId, message, userId) {

  return new Promise((resolve, reject) => {

    redisClient.lpush(channelId+'Messages', message, (error, reply) => {

      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }

    });
  });
}

module.exports.getMessages = getMessages;
module.exports.addMessage = addMessage;

