gms.ui.contacts = new (function() {

	var _datatable;

	this.onEditClick = function(e) {
		var tr = $(e.target).parent().parent();
		var data = gms.ui.contacts.datatable.row(tr).data();
		$('#contact_panel').attr('data-id', data.id);
		$('#empId').val(data.employeeId);
		$('#phone').val(data.phoneNumber);
		$('#mobile').val(data.mobileNumber);
		$('#address').val(data.address);
		$('#city').val(data.city);
		$('#pin').val(data.pin);
	}
	
	/**
	 * On Delete Event
	 */
	this.onDeleteClick = function(e){
		
		var contactObject = {};
		var tr = $(e.target).parent().parent();
		var data = gms.ui.contacts.datatable.row(tr).data();
		
		if(confirm("Are you sure?")){
		if(data.id){
			contactObject = data;
			gms.client.contacts.deleteContact(contactObject,
					_onSuccessContactDelete, _onErrorContact);
		}}
	}
	
	var _onSuccessContactDelete = function(response) {
		if (response.header.success) {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact Successfully Deleted');
			_clearPanel();
			
			if(response.body) {
				var contacts = _datatable.rows().data().toArray();
				
				for(var index in contacts) {
					var contact = contacts[index];
					if(contact.id == response.body.id) {
						contacts.splice(index, 1);
						break;
					}
				}
				
				_datatable.clear();
				_datatable.rows.add(contacts);
				_datatable.draw();
			}
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact deletion failed');
		}
	}

	
	
	this.onClickAddNewContactButton = function(e){
		$('html, body').animate({
	        scrollTop: $("#newContactForm").offset().top
	    }, 1000);
	}
	
		
	/**
	 * function name List Contacts on success return
	 */
	var _onSuccessContactList = function(response) {

		if (response.header.success) {
			var contacts = response.body;
			_datatable.clear();
			_datatable.rows.add(contacts);
			_datatable.draw();
			
			    $('html, body').animate({
			        scrollTop: $("#contactListing").offset().top
			    }, 1000);
			
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Error on fetching Designation');
		}
	}
	var _onErrorContactList = function(response) {

	}

	/**
	 * function name: New Contact addition
	 */
	this.newContact = function() {

		var contactObject = {};

		var id = $("#contact_panel").data('id');

		contactObject.employeeId = $('#empId').val();
		contactObject.phoneNumber = $('#phone').val();
		contactObject.mobileNumber = $('#mobile').val();
		contactObject.address = $('#address').val();
		contactObject.city = $('#city').val();
		contactObject.pin = $('#pin').val();

		if (id) {
			contactObject.id = id;
			gms.client.contacts.updateContact(contactObject,
					_onSuccessContactUpdate, _onErrorContact);
		} else {
			gms.client.contacts.addContact(contactObject,
					_onSuccessContactCreate, _onErrorContact);
		}
	}

	var _clearPanel = function() {
		$('#contact_panel').attr('data-id', '');
		$('#empId').val("");
		$('#phone').val("");
		$('#mobile').val("");
		$('#address').val("");
		$('#city').val("");
	}

	var _onSuccessContactUpdate = function(response) {
		if (response.header.success) {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact Successfully Updated');
			_clearPanel();
			
			if(response.body) {
				var contacts = _datatable.rows().data().toArray();
				
				for(var index in contacts) {
					var contact = contacts[index];
					
					if(contact.id == response.body.id) {
						contacts.splice(index, 1);
						contacts.push(response.body);
						break;
					}
				}
				
				_datatable.clear();
				_datatable.rows.add(contacts);
				_datatable.draw();
			}
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact addition failed');
		}
	}

	var _onSuccessContactCreate = function(response) {
		if (response.header.success) {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact Successfully added');
			_clearPanel();
		} else {
			gms.util.notify(gms.util.NOTIFICATION_TYPE.NOTICE,
					'Contact addition failed');
		}
	}

	var _onErrorContact = function(e, x, h) {

	}
	
	this.init = function() {
		_datatable = gms.ui.contacts.datatable = $('#contactsData')
				.DataTable(
						{
							columns : [
									{
										data : "employeeId"
									},
									{
										data : "phoneNumber"
									},
									{
										data : "mobileNumber"
									},
									{
										data : "address"
									},
									{
										data : "city"
									},
									{
										data : "pin"
									},
									{
										data : "personalEmail"
									},
									{
										data : "professionalEmail"
									},
									{
										defaultContent : '<a class="contact-edit" href="javascript:void(0)">Edit</a>'
											+ '<a class="contact-delete" href="javascript:void(0)">Delete</a>',
									} ],
								"drawCallback" : function(settings) {
									$('a.contact-edit').click(gms.ui.contacts.onEditClick);
									$('a.contact-delete').click(gms.ui.contacts.onDeleteClick);
								}
						});

		gms.client.contacts.listContacts(_onSuccessContactList, _onErrorContactList);

		$("#add_contact").click(gms.ui.contacts.newContact);
		$("#addNewContact").click(gms.ui.contacts.onClickAddNewContactButton);
	}

})();
