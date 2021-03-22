gms.ui.login = new (function(){
	
	this.init = function() {
	    var hashes = window.location.href.split('?');
	    
	    if(hashes[1]) {
	    	var queries = hashes[1].split('&');
	    	
	    	gms.data.fetchFromServer.get('email-verification?'+queries[0], null, function(response) {
	    		if(response.success) {
	    			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
	    		} else {
	    			gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, response.message);
	    		}
	    	});
	    }
		
		gms.client.loginOperation.isAuthentic(function(response){
			if(response.success && response.body) {
				window.location.replace("./");
			}
		}, function(){
			console.log('Error')
		});
		
		$('#login').click(gms.ui.login.login);
		$('#signup').click(function(){
			window.location.replace("./gms-user-registration");
		});
	}
	
	this.login = function(){
		var login = {};
		
		login.username = $('#user_id').val();
		login.password = $('#password').val();
		
		gms.client.loginOperation.login(login, function(response){
			if(response.success) {
				window.location.replace("./");
			} else {
				var message = response.message;
				
				if(response.data.attemptLeft !== undefined) {
					message = message + "\n" + "Attempt Left : " + response.data.attemptLeft;
				}
				
				gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, message);
			}
		}, function(x, h, e){
			gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, x)
		})
	}
	
	this.logout = function(){
		gms.client.loginOperation.logout(function(){
			window.location.replace("./login");
		});
	}
})();

$(document).ready(gms.ui.login.init);