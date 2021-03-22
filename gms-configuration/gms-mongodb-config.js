/**
 * http://usejsdoc.org/
 */

exports.MONGO_DEV = {
	host : '127.0.0.1',
	port : '27017',
	schema : 'gms'
};

exports.MONGO_QA = {
	host : '',
	port : '',
	schema : ''
};

exports.MONGO_PRODUCTION = {
	host : '',
	port : '',
	schema : ''
};

exports.getURL = function(config) {
	return 'mongodb://' + config.host + ':' + config.port + '/' + config.schema;
}