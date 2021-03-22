/**
 * http://usejsdoc.org/
 */

var Credential = require('../gms-model/gms-model-users.js');
var repository = require('../gms-repo/generic-repository.js');
var ROLE = require('../gms-const/gms-constants.js').ROLE;
var LOGIN_ATTEMPT = require('../gms-const/gms-constants.js').LOGIN_ATTEMPT;
var hashing = require('../gms-utils/cryptography.js');
var utils = require('../gms-utils/utils.js');
var verificationUtils = require('../gms-verification/verification-utils.js');
var emailSender = require('../gms-mail/mailgun-sender.js');

var invalidPassword = new Error("Invalid Password");
var invalidData = new Error("Invalid Data");
var loginAttemptExceeded = new Error("Login Attempt Exceeded");
var invalidCredential = new Error("Invalid Credentials");
var passwordMismatch = new Error("New Passwords are mismatched");
var invalidRole = new Error("Invalid Role");
var blankUserId = new Error("User Id is Blank");
var emailIdAlreadyVerified = new Error("Your email id is already verified");
var mobileNumberAlreadyVerified = new Error("Your mobile number is already verified");
var invalidOTP = new Error("OTP is invalid or Expired");
var invalidEmailLink = new Error("Link is invalid or Expired");
var userNotVerified = new Error("Your Email Id is not verified");

var loginAttemptCounter = {};

//this function is an attempt of login
var attempt = function(email, password, callback){
	repository.getOne(Credential, {email: email, status : true}, function(err, data){
		if(err) {
			callback(err);
		} else {
			if(data) {
				if(hashing.check(data.password, password)) {//valid login
					if(data.verified) {
						callback(null, data);
					} else {
						callback(userNotVerified);
					}
				} else {//invalid password
					if(loginAttemptCounter[email]) {
						loginAttemptCounter[email] = loginAttemptCounter[email] + 1;
					} else {
						loginAttemptCounter[email] = 1;
					}
					
					invalidCredential.attemptLeft = LOGIN_ATTEMPT.MAXIMUM - loginAttemptCounter[email];
					
					callback(invalidCredential);
				}
			} else {//user not present or blocked
				if(loginAttemptCounter[email]) {
					loginAttemptCounter[email] = loginAttemptCounter[email] + 1;
				} else {
					loginAttemptCounter[email] = 1;
				}
				
				invalidCredential.attemptLeft = LOGIN_ATTEMPT.MAXIMUM - loginAttemptCounter[email];
				
				callback(invalidCredential);
			}
		}
	});
};

/**
 * this function is used to register user
 * 
 * @param {User.Schema} data
 * @param {function} callback
 */
exports.register = function(data, callback) {
	if(data) {
		if(utils.isValidPassword(data.password, 6)) {
			data.password = hashing.getHash(data.password);
			data.role = ROLE.APLICATION_USER;
			data.status = true;
			data.verified = false;
			
			repository.save(Credential, data, function(err, credential) {
				if(err) {
					callback(err);
				} else {
					delete credential.password;
					callback(null, credential);
				}
			});
		} else {
			callback(invalidPassword);
		}
	} else {
		callback(invalidData);
	}
};

exports.adminRegister = function(data, callback) {
	if(data) {
		if(utils.isValidPassword(data.password, 6)) {
			data.password = hashing.getHash(data.password);
			data.role = ROLE.ADMIN_USER;
			data.status = true;
			data.verified = true;
			
			repository.save(Credential, data, function(err, credential) {
				if(err) {
					callback(err);
				} else {
					delete credential.password;
					callback(null, credential);
				}
			});
		} else {
			callback(invalidPassword);
		}
	} else {
		callback(invalidData);
	}
};

/**
 * this function is used to update user's informations
 * except active, role, password
 * 
 * @param {String} email
 * @param {Object} data
 * @param {function} callback
 */
exports.updateUser = function(email, data, callback){
	if(data) {
		callback(null, data);
	} else {
		callback(invalidData);
	}
};

/**
 * this function is used to login
 * 
 * @param {String} email
 * @param {String} password
 * @param {function} callback
 */
exports.login = function(email, password, callback){
	if(loginAttemptCounter[email]){//already attempted for login
		if(loginAttemptCounter[email] === LOGIN_ATTEMPT.MAXIMUM) {//maximum attempt over
			callback(loginAttemptExceeded);
		} else { // go for another attempt
			attempt(email, password, callback);
		}
	} else {//first attempt
		attempt(email, password, callback);
	}
};

/**
 * this function is used to get profile information
 * 
 * @param {String} userId
 * @param {function} callback
 */
exports.getUserInformation = function(email, callback) {
	if(email) {
		repository.getOne(Credential, {email : email}, function(err, credObj) {
			if(err) {
				callback(err);
			} else {
				if(credObj) {
					delete credObj.password;
				}
				
				callback(null, credObj);
			}
		});
	} else {
		callback(blankUserId)
	}
};

/**
 * this function is used to update profile information
 * 
 * @param {String} userId
 * @param {User} profile
 * @param {function} callback
 */
exports.updateUserInformation = function(email, profile, callback) {
	if(email) {
		repository.getOne(Credential, {email : email}, function(err, credObj) {
			if(err) {
				callback(err) ;
			} else {
				delete credObj.verified;
				delete credObj.email;
				delete credObj.status;
				
				credObj.mobile = profile.mobile;
				credObj.name = profile.name;
				credObj.address = profile.address;
				
				
				repository.update(Credential, {email : email}, credObj, function(err, profObj) {
					if(err) {
						callback(err);
					} else {
						callback(null, profObj);
					}
				});
			}
		});
	} else {
		callback(blankUserId);
	}
};


/**
 * 
 */
exports.initiateEmailVerification = function(email, callback) {
	if(email) {
		repository.getOne(Credential, {email : email}, function(err, credObj){
			if(err) {
				callback(err);
			} else {
				if(credObj.verified) {
					callback(emailIdAlreadyVerified);
				} else {
					verificationUtils.generateEmailVerificationLink(email, email, credObj.name, emailSender.send, callback);
				}
			}
		}, 'name verified');
	} else {
		callback(blankUserId);
	}
}

/**
 * 
 */
exports.verifyEmailId = function(verificationToken, callback) {
	verificationUtils.verifyEmailOTP(verificationToken, function(err, email) {
		if(err) {
			callback(invalidEmailLink);
		} else {
			if(email) {
				repository.getOne(Credential, {email : email}, function(err, credObj){
					if(err) {
						callback(err);
					} else {
						credObj.verified = true;
						repository.update(Credential, {email : email}, credObj, callback);
					}
				});
			} else {
				callback(invalidEmailLink);
			}
		}
	});
};