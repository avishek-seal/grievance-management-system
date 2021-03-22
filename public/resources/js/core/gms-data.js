gms.data.fetchFromServer = new (function(){
	
	var _baseURL = './';
	
	var _contentType = "application/json";
	
	var _commonAlways = function(response){
		if(response && response.success) {
			gms.util.setAuthToken(response.token);
		} else if(response && !response.token){
			gms.util.removeAuthToken() ;
			//redirect to login
		}
	};
	
	this.init = function(){
		_baseURL = './'
	}

	/**
	 * this function is used to GET data from server resource
	 * 
	 * @param resource {string}
	 * @param criteria {gms.data.Criteria}
	 * @param onSuccess {function}
	 * @param onError {function}
	 * @param always {function}
	 */
	this.get = function(resource, criteria, onSuccess, onError, always) {
		var url = _baseURL + resource;
		
		if(criteria && criteria.id) {
			url = url +'?id='+criteria.id;
		} else if(criteria && criteria.other && criteria.other.length) {
			url = url + '?';
			var query = "";
			
			$.each(criteria.other, function(key, value){
				query = query + key + '=' + value + '&';
			});
			
			query = query.substring(0, query.length - 1);
			
			url = url + query;
		}
		
		var ajaxObject = { method: "GET", url: url};
		var headers = {};
		
		headers.token = gms.util.getAuthToken();
		headers['Content-Type'] = _contentType;
		
		ajaxObject.headers = headers;
		
		$.ajax(ajaxObject)
		.done(onSuccess)
		.fail(onError)
		.always(_commonAlways);
	}
	
	/**
	 * this function is used to POST data to server resource
	 * 
	 * @param resource {string}
	 * @param data {Object}
	 * @param onSuccess {function}
	 * @param onError {function}
	 * @param always {function}
	 */
	this.post = function(resource, data, onSuccess, onError, always) {
		var url = _baseURL + resource;
		var ajaxObject = { method: "POST", url: url, data: JSON.stringify(data)};
		var headers = {};
		
		headers.token = gms.util.getAuthToken();
		headers['Content-Type'] = _contentType;
		
		ajaxObject.headers = headers;
		
		$.ajax(ajaxObject)
		.done(onSuccess)
		.fail(onError)
		.always(_commonAlways);
	}
	
	/**
	 * this function is used to PUT data to server resource
	 * 
	 * @param resource {string}
	 * @param data {Object}
	 * @param onSuccess {function}
	 * @param onError {function}
	 * @param always {function}
	 */
	this.put = function(resource, data, onSuccess, onError, always) {
		var url = _baseURL + resource;
		var ajaxObject = { method: "PUT", url: url, data: JSON.stringify(data)};
		var headers = {};
		
		headers.token = gms.util.getAuthToken();
		headers['Content-Type'] = _contentType;
		
		ajaxObject.headers = headers;
		
		$.ajax(ajaxObject)
		.done(onSuccess)
		.fail(onError)
		.always(_commonAlways);
	}
	
	/**
	 * this function is used to DELETE data to server resource
	 * 
	 * @param resource {string}
	 * @param data {Object}
	 * @param onSuccess {function}
	 * @param onError {function}
	 * @param always {function}
	 */
	this.del = function(resource, data, onSuccess, onError, always) {
		var url = _baseURL + resource;
		var ajaxObject = { method: "DELETE", url: url, data: JSON.stringify(data)};
		var headers = {};
		
		headers.token = gms.util.getAuthToken();
		headers['Content-Type'] = _contentType;
		
		ajaxObject.headers = headers;
		
		$.ajax(ajaxObject)
		.done(onSuccess)
		.fail(onError)
		.always(_commonAlways);
	};
})();

