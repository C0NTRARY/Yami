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
 */
function getUsers(channelId) {

  return new Promise((resolve, reject) => {

    redisClient.smembers(channelId+'Users', (error, items) => {

      if (error) {
        reject(error);
      } else {
        resolve(items);
      }
    });
  });
}

/**
 * 
 * @param {*} userId 
 * @param {*} channelId 
 */
function addUser(userId, channelId) {

  return new Promise((resolve, reject) => {

    redisClient.sadd(channelId+'Users', userId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports.getUsers = getUsers;
module.exports.addUser = addUser;
