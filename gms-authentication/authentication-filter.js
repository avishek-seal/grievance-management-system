/**
 * http://usejsdoc.org/
 */
var utils = require('../gms-utils/utils.js');
var cache = require('../gms-cache/redis-client.js');
var authentication = require('./authentication.js');
var Response = require('../gms-response/response-model.js').Response;

/**
 * this function is used to authenticate the request
 * @param {Object} req
 * @param {Object} res
 * @param {function(token, requestBody)} callback
 */
exports.filter = function(req, res, callback) {
	var mac = utils.getClientIP(req);
	
	cache.isNotExist(req.headers.token, function(err, notExist){
		if(err) {
			res.send(new Response(false, null, err.text, err));
		} else {
			if(notExist) {
				authentication.verifyToken(req.headers.token, function(err, user){//decodes token
					if(err) {
						res.send(new Response(false, null, "Failure", err));
					} else {
						authentication.authenticate(user, mac, function(authentic) {//verifies origin ::  Prevents Session hijacking
							if(authentic) {
								callback(user, req.body);
							} else {
								res.send(new Response(false, null, "Failure", null));
							}
						});
					}
				});
			} else {
				res.send(new Response(false, null, "Non Ethical Hacking is Illegal", null));
			}
		}
	});
};