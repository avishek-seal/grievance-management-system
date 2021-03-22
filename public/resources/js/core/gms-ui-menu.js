gms.ui.menu = new (function(){
	
	var _pageMap = {
			'ADMIN_USER' : {
				'view_all_complains' : {
					'path' : 'resources/pages/view_grievances.html',
					'callback' : gms.ui.adminGrievance.init
				}
			},
			
			'APP_USER' : {
				'add_complain' : {
					'path' : 'resources/pages/submit-grievances.html',
					'callback' : gms.ui.userGrievance.init
				}
			}
	};

	this.init = function(){
		gms.data.fetchFromServer.get('role', null, function(response) {
			$.each($('.gms-menu-element'), function(index, element){
				var pageType = $(element).data('page-type');
				
				if(_pageMap[response.data][pageType]) {
					$(element).parent().show();
				} else {
					$(element).parent().hide();
				}
			});
			
			$('a.gms-menu-element').click(function(){
				var pageType = $(this).data('page-type');
				
				$("#gms_page_container").empty();
				$("#gms_page_container").load(_pageMap[response.data][pageType].path, _pageMap[response.data][pageType].callback);
			});
			
			$("#"+response.data+" > a.gms-menu-element").click();
		}, function(error) {
			
		});
		
	};
})();