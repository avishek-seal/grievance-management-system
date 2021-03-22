gms.util.setAuthToken = function(token){
	$.cookie("token", token);
}

gms.util.getAuthToken = function(){
	return $.cookie("token");
}

gms.util.removeAuthToken = function(){
	return $.removeCookie("token");
}

var _notification = {
	'error' : $.growl.error,
	'notice' : $.growl.notice,
	'warning' : $.growl.warning
}

gms.util.NOTIFICATION_TYPE = {
	ERROR : 'error',
	NOTICE : 'notice',
	WARNING : 'warning'
}
gms.util.notify = function(type, message){
	_notification[type]({ message: message });
}

gms.util.downloadPDF = function(columns, rows, fileName){
	var doc = new jsPDF('landscape');
	
	doc.autoTable(columns, rows, {
		theme: 'grid',
		styles: {
			cellPadding: 1, // a number, array or object (see margin below)
		    fontSize: 7,
		    font: "courier", // helvetica, times, courier
		    lineColor: 150,
		    lineWidth: 0.3,
		    fontStyle: 'normal', // normal, bold, italic, bolditalic
		    overflow: 'linebreak', // visible, hidden, ellipsize or linebreak
		   // fillColor: {fillColor: [100, 255, 255]}, // false for transparent or a color as described below
		    textColor: 20,
		    halign: 'left', // left, center, right
		    valign: 'middle', // top, middle, bottom
		    columnWidth: 'auto' // 'auto', 'wrap' or a number
	    },
	    columnStyles: {
	    	id: {fillColor: 255}
	    },
	    margin: {top: 20},
	    addPageContent: function(data) {
	    	doc.text("Grievance Report : " + (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-'), 15, 10);
	    }
	});
	
	doc.save(fileName);
}