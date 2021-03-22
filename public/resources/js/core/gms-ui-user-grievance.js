/**
 * New node file
 */
gms.ui.userGrievance = new (function(){
	var _datatable;
	
	this.onViewDetails = function(e) {
		var row = $(e.target).parent().parent()
		var data = _datatable.row(row).data();
		
		$("#view_details_title").empty().html('Grievance Id : '+ data.identity);
		$("#grievance_details").empty().html(data.details);
		$("#view_details_summary").empty().html('Summary : ' + data.summary);
		$('#view_details').modal('toggle');
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
	
	var _onSuccessSubmit = function(response) {
		if(response.success) {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
			
			var grievances = _datatable.rows().data();
			grievances.push(response.data);
			_datatable.clear();
			_datatable.rows.add(grievances);
			_datatable.draw();
			_clearModal();
			
			$('#grievance_modal').modal('toggle');
		} else {
			_onErrorSubmit(response.message)
		}
	}
	
	var _clearModal = function(){
		$('#summary').val('');
		$('#respondent').val('');
		$('#description').val('');
	}
	var _onErrorSubmit = function(message) {
		gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, message);
	}
	
	this.submitGrievance = function() {
		var grievance = new gms.model.Grievance(null, $('#summary').val(), $('#respondent').val(), $('#description').val(), null, null, null)
		gms.client.userGrievance.submit(grievance, _onSuccessSubmit, _onErrorSubmit);
	}
	
	var _onSuccessGrievanceList = function(response) {
		if (response.success) {
			var grievances = response.data;
			_datatable.clear();
			_datatable.rows.add(grievances);
			_datatable.draw();
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE, response.message);
		}
	}
	
	var _onErrorGrievanceList = function(error) {
		gms.util.notify(gms.util.NOTIFICATION_TYPE.ERROR, error);
	}
	
	this.init = function() {
		$('#my_grievances thead tr').clone(true).appendTo('#my_grievances thead');
		$('#my_grievances thead tr:eq(1) th').each( function (i) {
	        var title = $(this).text();
	        $(this).html( '<input type="text" style="width: 100%;"/>' );
	 
	        $('input', this).on( 'keyup change', function () {
	            if ( _datatable.column(i).search() !== this.value ) {
	            	_datatable .column(i).search(this.value).draw();
	            }
	        });
	  });
		
		_datatable = $('#my_grievances')
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
					            	return new Date(row.updated).toLocaleDateString();
					            } 
							},
							{
								data : _prepareComments
							}],
							
							 columnDefs: [
						              {
						                  targets: -1,
						                  className: 'dt-body-center dt-head-center'
						              }
				            ],
						"drawCallback" : function(settings) {
							$('a.view_details').click(gms.ui.userGrievance.onViewDetails);
						}
				});

		gms.client.userGrievance.getGrievances(_onSuccessGrievanceList, _onErrorGrievanceList);
				
		$("#save_grievance").click(gms.ui.userGrievance.submitGrievance);
	};
	
})();