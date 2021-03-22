/**
 * http://usejsdoc.org/
 */
var redisConfig = require('../gms-configuration/gms-redis-config.js')
var redis = require("redis");
var client = redis.createClient(redisConfig.REDIS_DEV);

client.select(4, function(){
	console.log('db4 is connected for email verification caching');
});

client.on('connect', function() {
    console.log(':: Redis Connected For Email Verification ::');
});

exports.set = function(key, value, expiryTime) {
	client.set(key, value);
	client.expire(key, expiryTime);
};

exports.get = function(key, callback) {
	return client.get(key, callback);
};