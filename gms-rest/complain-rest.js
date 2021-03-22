/**
 * http://usejsdoc.org/
 */
var Response = require('../gms-response/response-model.js').Response;
var authentication = require('../gms-authentication/authentication.js');
var authenticationFilter = require('../gms-authentication/authentication-filter.js');
var complainBusiness = require('../gms-business/complain-business.js');
var ROLE = require('../gms-const/gms-constants.js').ROLE;

exports.create = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.APLICATION_USER) {
				complainBusiness.save(body, token.username, function(err, object){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Successfully Submitted", object));
					}
				});
			} else {
				res.send(new Response(false, req.headers.token, "Un-Authorized Operation", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.getAll = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.ADMIN_USER) {
				complainBusiness.getAll(function(err, objects){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Successfully Fetched", objects));
					}
				});
			} else {
				res.send(new Response(false, req.headers.token, "Un-Authorized Operation", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.getUsersComplain = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.APLICATION_USER) {
				complainBusiness.get(token.username, function(err, objects){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Successfully Fetched", objects));
					}
				});
			} else {
				res.send(new Response(false, req.headers.token, "Un-Authorized Operation", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};

exports.addComment = function(req, res) {
	authenticationFilter.filter(req, res, function(token, body) {
		if(token) {
			if(token.role === ROLE.ADMIN_USER) {
				complainBusiness.addComment(body.identity, body.comment, function(err, object){
					if(err) {
						res.send(new Response(false, req.headers.token, err.message, null));
					} else {
						res.send(new Response(true, req.headers.token, "Comment Added", object));
					}
				});
			} else {
				res.send(new Response(false, req.headers.token, "Un-Authorized Operation", null));
			}
		} else {
			res.send({success : false, code: 403});
		}
	});
};