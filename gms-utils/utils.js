exports.isValidPassword = function(password, length){
	return !!(password && password.length > length);
};

exports.getClientIP = function(req) {
	var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
	
	return ip;
};