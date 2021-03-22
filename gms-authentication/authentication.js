/**
 * http://usejsdoc.org/
 */
var jwt = require('jsonwebtoken');
var fs = require("fs");
var cert = String(fs.readFileSync(__dirname+'/../private.key'));

/**
 * this function is used to generate JWT token
 * 
 * @param {string} username
 * @param {string} mac
 */
exports.generateToken = function(username, role, mac) {
	var token = jwt.sign({username: username, role: role, mac: mac, signInAt: new Date().getTime()}, cert, {
		expiresIn: 1440 // expires in 24 hours
    });
	
	return token;
};

/**
 * this function is used to verify and decode token
 * 
 * @param {string} token
 * @param {function(err, decoded)} callback
 */
exports.verifyToken = function(token, callback) {
	jwt.verify(token, cert, callback);
};

/**
 * this function is used to authenticate origin,
 * i.e. Prevents Session Hijacking or Token Hacking
 * 
 * @param {Object} token
 * @param {string} mac
 * @param {function} callback
 */
exports.authenticate = function(token, mac, callback) {
	callback((token && token.mac === mac));
};