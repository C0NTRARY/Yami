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

      if (error) {
        console.log('in getChannel error');
        reject(error);
      } else {
        console.log('in getchannel success');
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

module.exports.getChannel = getChannel;
module.exports.createChannel = createChannel;
