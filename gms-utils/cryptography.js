/**
 * http://usejsdoc.org/
 */

var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);

/**
 * this function is used to convert normal text
 * to hash
 * 
 * @param {String} password
 * @returns String
 */
exports.getHash = function(password) {
	return bcrypt.hashSync(password, salt);
};

/**
 * this function is used to check equality of encrypted
 * and un-encrypted text
 * 
 * @param {String} hash
 * @param {String} password
 * @returns Boolean
 */
exports.check = function(hash, password) {
	return bcrypt.compareSync(password, hash);
};