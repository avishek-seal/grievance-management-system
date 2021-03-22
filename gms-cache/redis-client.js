
var redisConfig = require('../gms-configuration/gms-redis-config.js')
var redis = require("redis");
var client = redis.createClient(redisConfig.REDIS_DEV);

client.on('connect', function(arg) {
    console.log(':: Redis Connected ::');
    console.log(arg);
});

/**
 * this function is used to add in
 * redis data structure storage
 * 
 * @param {string} token
 * @param {Date} expiryTime
 */
exports.setKey = function(token, expiryTime) {
	var now = new Date();
	client.set(token, now);
	client.expire(token, expiryTime);
};

/**
 * this function is used to check whether
 * token is present in redis data structure storage
 * @param {string} token
 * @param {function} calback
 */
exports.isNotExist = function(token, callback) {
	client.exists(token, function(err, reply) {
		if(err) {
			callback(err);
		} else {
			callback(null, (reply !== 1));
		}
	});
};