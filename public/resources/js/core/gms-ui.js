gms.ui.container = new (function(){
	
	this.init = function(){
		gms.client.loginOperation.isAuthentic(function(response){
			if(response && response.success) {
				$('#gms_header').load('resources/pages/header.html');
				$('#gms_menu').load('resources/pages/menu.html', gms.ui.menu.init);
			} else {
				window.location.replace("./login");
			}
		}, function(){
			window.location.replace("./login");
		}); 
	}
})();

$(document).ready(gms.ui.container.init);