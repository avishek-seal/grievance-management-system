gms.client.loginOperation = new (function(){
	
	this.login = function(credentialObject, onSuccess, onError){
		if(credentialObject) {
			var valid = true;
			if(!credentialObject.username) {
				onError("Please Enter Username");
				valid = false;
			}
			
			if(!credentialObject.password) {
				onError("Please Enter Password");
				valid = false;
			}
			
			if(valid) {
				gms.data.fetchFromServer.post('signin', credentialObject, onSuccess, onError);
			}
			
		}
	};
	
	this.logout = function(onSuccess, onError){
		gms.data.fetchFromServer.post('signout', {}, onSuccess, onError);
	};
	
	this.isAuthentic = function(onSuccess, onError){
		gms.data.fetchFromServer.get('is-authentic', null, onSuccess, onError);
	};
})();