/**
 * http://usejsdoc.org/
 */
var utils = require('../gms-utils/utils.js');
var inMemory = require('../gms-cache/redis-client.js');
var Response = require('../gms-response/response-model.js').Response;
var authentication = require('../gms-authentication/authentication.js');
var authenticationFilter = require('../gms-authentication/authentication-filter.js');
var userBusiness = require('../gms-business/user-business.js');
var ROLE = require('../gms-const/gms-constants.js').ROLE;

exports.adminProfile = {
		email : 'admin@admin.com',
		password: 'password@admin',
		name : 'Admin',
		mobile : '9999999999'
};

exports.setAdmin = function(admin) {
	if(admin && admin.email && admin.password) {
		userBusiness.getUserInformation(admin.email, function(err, object) {
			if(!err && !object) {
				userBusiness.adminRegister(admin, function(err, product){
					if(err) {
						console.log(err);
					} else {
						console.log('Admin Created')
					}
				});
			}
		})
	}
}

/**
 * this function is used to register user
 */
exports.registration = function(req, res) {
	userBusiness.register(req.body, function(err, product){
		if(err) {
			res.send(new Response(false, null, err.message, null));
		} else if(product) {
			userBusiness.initiateEmailVerification(product.email, function(err) {
				if(err) {
					//delete user
					res.send(new Response(false, null, err.message, null));
					console.log(err.stack);
				} else {
					res.send(new Response(true, null, "Registration Successful, Please check your email id for Email Verification", null));
				}
			});
		}
	});
};

/**
 * this function is used to login
 */
exports.login = function(req, res) {
	userBusiness.login(req.body.username, req.body.password, function(err, data) {
		if(err) {
			res.send(new Response(false, null, err.message, err));
		} else {
			var mac = utils.getClientIP(req);
			var token = authentication.generateToken(data.email, data.role, mac);
			
			delete data._doc.password;
			delete data._doc.email;
			delete data._doc.role;
			delete data._doc._id;
			
			res.send(new Response(true, token, "Login Successful", data));
		}
	});
};

/**
 * this function is used to logging out from
 * the application
 */
exports.logout = function(req, res){
	var mac = utils.getClientIP(req);
	
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			var timeOutTime = Math.abs(token.iat - token.exp) * 60;
			var timeSpent = (new Date().getTime() - token.signInAt)/1000;
			
			var timeLeft = parseInt(timeOutTime - timeSpent);
			
			inMemory.setKey(req.headers.token, timeLeft);
			res.send(new Response(true, null, "Successfully Logged Out", null));
		} else {
			res.send(new Response(false, null, "Non Authentic Request", null));
		}
	});
};

exports.isAuthentic = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			res.send({success : true, code: 200})
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.getRole = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			res.send({success : true, data: token.role})
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.getProfile = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.APLICATION_USER) {
				userBusiness.getUserInformation(token.username, function(err, object){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Got Profile Information", object));
					}
				});
			} else {
				res.send(new Response(true, req.headers.token, "Didn't Get Profile Information", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.updateProfile = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.APLICATION_USER) {
				userBusiness.updateUserInformation(token.username, body, function(err, object){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Updated Profile Information", object));
					}
				});
			} else {
				res.send(new Response(true, req.headers.token, "Didn't Get Profile Information", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.verifyLink = function(req, res) {
	userBusiness.verifyEmailId(req.query.otp, function(err) {
		if(err) {
			res.send(new Response(false, req.headers.token, err.message, null));
		} else {
			res.send(new Response(true, req.headers.token, "Email id is verified", null));
		}
	});
};