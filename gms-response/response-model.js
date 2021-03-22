/**
 * http://usejsdoc.org/
 */


/**
 * @constructor
 */
exports.Response = function(success, token, message, data) {
	this.success = success;
	this.token = token;
	this.message = message;
	this.data = data;
};