/**
 * http://usejsdoc.org/
 */

var EmailLinkCache = require('../gms-cache/email-verification-caching-client.js');
var AESEncryption = require('../gms-utils/aes-encryption.js');
var randomNumber = require('random-number');

var options = {min:  1000, max:  999999, integer: true};

var gen = randomNumber.generator(options);

var EXPIRY_TIME = 2 * 24 * 60 * 60; // 2 days

var MAIL_TEMPLATE = '<p>Dear #name</p>'
	+'<p>Thank you for registering in GMS.</p>'
	+'<p>Please click on this <a href="#link">LINK</a> to complete your registration with us.</p>'
	+'<p>Thanks</p>'
	+'<p>Grievance Management System Team</p>';

var createLink = function(text) {
	return "http://13.127.67.24:3000/login?otp=" +  encodeURIComponent(text);
};

/**
 * 
 */
exports.generateEmailVerificationLink = function(userId, email, name, callbackOne, callbackTwo) {
	var OTP = gen();
	
	EmailLinkCache.set(OTP, userId, EXPIRY_TIME);
	
	var encryptedOTP = AESEncryption.encrypt(String(OTP));
	var body = MAIL_TEMPLATE.replace("#name", name).replace("#link", createLink(encryptedOTP));
	callbackOne(email, 'Verification Link', body, callbackTwo);
};

/**
 * 
 */
exports.verifyEmailOTP = function(EncryptedOTP, callback) {
	var decryptedOTP = AESEncryption.decrypt(EncryptedOTP);
	
	EmailLinkCache.get(decryptedOTP, callback);
};
