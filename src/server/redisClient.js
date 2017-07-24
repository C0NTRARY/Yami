const redis = require('redis');
const redisClient = redis.createClient();
const geo = require('georedis').initialize(redisClient, {
    zset: 'Channels'
});

// default radius
let radius = 500;

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

/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} radius 
 */
function getChannel(latitude, longitude, radius) {

  return new Promise((resolve, reject) => {

    const options = {
      withCoordinates: true,
      withHashes: true, 
      withDistances: true,
      order: 'ASC',
      units: 'mi',
      count: 100, 
      accurate: true 
    }

    geo.nearby({latitude: latitude, longitude: longitude}, radius, options, (error, locations) => {

      if(error) {
        reject(error);
      } else {
        resolve(locations[0]);
      }

    });
  });
}

/**
 * 
 * @param {*} channelId 
 * @param {*} latitude 
 * @param {*} longitude 
 */
function createChannel(channelId, latitude, longitude) {

  return new Promise((resolve, reject) => {

    geo.addLocation(channelId, {latitude: latitude, longitude: longitude}, (error, reply) => {

      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    })
  });
}

/**
 * 
 * @param {*} channelId 
 */
function deleteChannel(channelId) {
  // this method should be transactional

  let p1 = new Promise((resolve, reject) => {
    geo.removeLocation(channelId, function(err, reply) {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });

  let p2 = new Promise((resolve, reject) => {
    redisClient.del(channelId+'Messages', channelId+'Users', (error, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });

  return new Promise.all([p1, p2]);
}

module.exports.getMessages = getMessages;
module.exports.addMessage = addMessage;
module.exports.getUsers = getUsers;
module.exports.addUser = addUser;
module.exports.getChannel = getChannel;
module.exports.createChannel = createChannel;
