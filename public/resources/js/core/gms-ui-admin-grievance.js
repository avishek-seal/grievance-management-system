/**
 * New node file
 */
gms.ui.adminGrievance = new (function(){
	var _datatable;
	var minDateFilter = "";
	var maxDateFilter = "";
	
	this.onViewDetails = function(e) {
		var row = $(e.target).parent().parent()
		var data = _datatable.row(row).data();
		
		$("#admin_view_details").attr("data-grievance-id", data.identity);
		$("#admin_view_details_title").empty().html('Grievance Id : '+ data.identity);
		$("#summary").empty().html(data.summary);
		$("#respondent").empty().html(data.respondent);
		
		$("#reported_by").empty().html(data.by.name);
		$("#email_id").empty().html(data.by.email);
		$("#address").empty().html(data.by.address);
		$("#phone").empty().html(data.by.mobile);
		
		$("#admin_grievance_details").empty().html(data.details);
		$('#admin_view_details').modal('toggle');
		$('#admin_grievance_comments').empty().html(_prepareComments(data));
	}
	
	var _prepareComments = function(row){
		var ul = "<ul>#li</ul>";
		var lis = "";
		
		if(row.comments && row.comments.length) {
			$.each(row.comments, function(index, value) {
				lis = lis + '<li>'+ value +'</li>';
			});
		}
		
		return ul.replace('#li', lis);
	};
	
	this.downloadPDF = function() {
		var data = _datatable.rows( { filter : 'applied'} ).data().toArray();
		
		if(data && data.length) {
			gms.client.adminGrievance.downloadPDF(data, function(message){
				gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, message);
			})
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, "No Grievance is present");
		}
	};
	
	this.addComment = function() {
		var comment = new gms.model.Comment($('#admin_view_details').attr('data-grievance-id'), $('#comment').val());
		gms.client.adminGrievance.addComment(comment, _onSuccessAddComment, _onErrorGrievanceList);
	};
	
	var _onSuccessGrievanceList = function(response) {
		if (response.success) {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
			var grievances = response.data;
			_datatable.clear();
			_datatable.rows.add(grievances);
			_datatable.draw();
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, response.message);
		}
	}
	
	var _onSuccessAddComment = function(response) {
		if(response.success) {
			$('#comment').val('');
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
			
			var grievances = _datatable.rows().data().toArray();
			
			for(var index in grievances) {
				if(grievances[index].identity === response.data.identity) {
					grievances[index].comments = response.data.comments;
					break;
				}
			}
			
			$('#admin_grievance_comments').empty().html(_prepareComments(response.data));
			_datatable.clear();
			_datatable.rows.add(grievances);
			_datatable.draw();
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, response.message);
		}
	};
	
	var _onErrorGrievanceList = function(error) {
		gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, error);
	}
	
	var _dateRangeFilterInit = function() {
		$("#datepicker_from").datepicker({
		    showOn: "button",
		    buttonImage: "images/calendar.gif",
		    buttonImageOnly: false,
		    endDate: '+0d',
	        autoclose: true,
		    "onSelect": function(date) {
		      minDateFilter = new Date(date).getTime();
		      _datatable.draw();
		    }
		  }).keyup(function() {
		    minDateFilter = new Date(this.value).getTime();
		    _datatable.draw();
		  }).change(function() {
		    minDateFilter = new Date(this.value).getTime();
		    _datatable.draw();
		  });

		  $("#datepicker_to").datepicker({
		    showOn: "button",
		    buttonImage: "images/calendar.gif",
		    buttonImageOnly: false,
		    endDate: '+0d',
	        autoclose: true,
		    "onSelect": function(date) {
		      maxDateFilter = new Date(date).getTime();
		      _datatable.draw();
		    }
		  }).keyup(function() {
		    maxDateFilter = new Date(this.value).getTime();
		    _datatable.draw();
		  }).change(function() {
			  maxDateFilter = new Date(this.value).getTime();
		    _datatable.draw();
		  });
	};
	
	$.fn.dataTableExt.afnFiltering.push(
			  function(oSettings, aData, iDataIndex) {
			    var updatedDateFilter = new Date(aData[3]).getTime();

			    if (minDateFilter && !isNaN(minDateFilter)) {
			      if (updatedDateFilter < minDateFilter) {
			        return false;
			      }
			    }

			    if (maxDateFilter && !isNaN(maxDateFilter)) {
			      if (updatedDateFilter > maxDateFilter) {
			        return false;
			      }
			    }

			    return true;
			  });
	$.fn.dataTable.moment( 'HH:mm MMM D, YY' );
	$.fn.dataTable.moment( 'dddd, MMMM Do, YYYY' );
	
	this.init = function() {
		$('#post_comment').click(gms.ui.adminGrievance.addComment);
		$('#admin_grievances thead tr').clone(true).appendTo('#admin_grievances thead');
		$('#admin_grievances thead tr:eq(1) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" style="width: 100%;"/>' );
	 
	        $('input', this).on( 'keyup change', function () {
	            if ( _datatable.column(i).search() !== this.value ) {
	            	_datatable .column(i).search(this.value).draw();
	            }
	        });
	  });
		
		_datatable = $('#admin_grievances')
		.DataTable(
				{
					orderCellsTop: true,
			        fixedHeader: true,
					columns : [
							{
								data : function(row) {
									return '<a class="view_details" href="javascript:void(0)">' + row.identity + '</a>';
								}
							},
							{
								data : "summary"
							},
							{
								data : "respondent"
							},
							{
								data : function(row){
					            	return new Date(row.created).toDateString();
					            } 
							},
							{
								data : "by.name"
							}, {
								data : _prepareComments
							}],
							
							 columnDefs: [
						              {
						                  targets: -1,
						                  className: 'dt-body-center dt-head-center'
						              }
				            ],
						"drawCallback" : function(settings) {
							$('a.view_details').click(gms.ui.adminGrievance.onViewDetails);
						}
				});

		gms.client.adminGrievance.getGrievances(_onSuccessGrievanceList, _onErrorGrievanceList);
		_dateRangeFilterInit();
	};
})();