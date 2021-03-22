/**
 * New node file
 */

gms.client.userGrievance = new (function(){
	
	this.getGrievances = function(onSuccess, onError) {
		gms.data.fetchFromServer.get('user-complain', null, onSuccess, onError);
	}
	
	this.submit = function(grievance, onSuccess, onError) {
		if(grievance) {
			var valid = true;
			
			if(!grievance.summary) {
				valid = false;
				onError("Please Enter Summary");
			}
			
			if(!grievance.respondent) {
				valid = false;
				onError("Please Enter Respondent");
			}
			
			if(!grievance.details) {
				valid = false;
				onError("Please Enter Description");
			}
			
			if(valid) {
				gms.data.fetchFromServer.post('user-complain', grievance, onSuccess, onError);
			}
		}
	}
})();
