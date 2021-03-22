/**
 * New node file
 */

gms.ui.registration = new (function(){
	
	this.init = function(){
		$('#gms_registration_form').validator().on('submit', function (e) {
		      if(e.isDefaultPrevented()) {
			    // handle the invalid form...
			  } else {
				e.preventDefault();
			    var user = new gms.model.User($('#email').val(), $('#password').val(), $('#name').val(), $('#mobile').val(), $('#address').val());
			    
			    gms.data.fetchFromServer.post('register', user, function(response) {
			    	if(response.success) {
			    		$('#email').val('');
			    		$('#password').val('');
			    		$('#name').val('');
			    		$('#mobile').val('');
			    		$('#address').val('');
			    		gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
			    		window.location.replace("./login");
			    	} else {
			    		gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, response.message);
			    	}
			    }, function(x, h, e) {
			    	gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, x);
			    });
			  }
		});
	}
	
})();

$(document).ready(gms.ui.registration.init);