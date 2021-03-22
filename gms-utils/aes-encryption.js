/**
 * http://usejsdoc.org/
 */

var CryptoJS = require("crypto-js");

var PRIVATE_KEY = '123ybdysiuys7dvysiuvhsiuh kdh csd';

exports.encrypt = function(text) {
	return CryptoJS.AES.encrypt(text, PRIVATE_KEY);
}

exports.decrypt = function(cipher) {
	var bytes  = CryptoJS.AES.decrypt(cipher, PRIVATE_KEY);
	return bytes.toString(CryptoJS.enc.Utf8);
}