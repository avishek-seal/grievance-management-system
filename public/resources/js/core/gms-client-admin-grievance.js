/**
 * New node file
 */

gms.client.adminGrievance = new (function(){
	
	var REPORT_HEADERS = [
	                      {title: "ID", dataKey: "identity"},
	                      {title: "Summary", dataKey: "summary"},
	                      {title: "Respondent", dataKey: "respondent"},
	                      {title: "Reporter", dataKey: "by.name"},
	                      {title: "Email", dataKey: "by.email"},
	                      {title: "Mobile", dataKey: "by.mobile"},
	                      {title: "Reported Date", dataKey: "created"},
	                      {title: "Details", dataKey: "details"},
	                      {title: "Resolutions", dataKey: "resolutions"}
	                   ];
	
	this.getGrievances = function(onSuccess, onError) {
		gms.data.fetchFromServer.get('complain', null, onSuccess, onError);
	}
	
	this.downloadPDF = function(rows, callback) {
		$.each(rows, function(index, row) {
			row.created = new Date(row.created).toDateString();
			
			row.resolutions = "";
			
			if(row.comments && row.comments.length) {
				$.each(row.comments, function(index, comment) {
					row.resolutions = row.resolutions + "["+comment+']\n';
				});
			} else {
				row.resolutions = "No Resolution is Set"
			}
		});
		
		var fileName = 'GMS-Report-' + (new Date().toLocaleDateString()).replace('/', '-').replace('/', '-') + '.pdf';
		
		gms.util.downloadPDF(REPORT_HEADERS, rows, fileName);
		
		if(callback && typeof callback == 'function') {
			callback(fileName + " will be downloaded shortly");
		}
	};
	
	this.addComment = function(comment, onSuccess, onError) {
		if(comment) {
			var valid = true;
			
			if(!comment.identity) {
				valid = false;
				onError('ID is not present');
			}
			
			if(!comment.comment) {
				valid = false;
				onError('No comment to add');
			}
			
			if(valid) {
				gms.data.fetchFromServer.post('complain-comment', comment, onSuccess, onError);
			}
		}
	};
	
})();
