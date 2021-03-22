gms.client.contacts = new (function(){
	
	this.listContacts = function(onSuccess, onError){
		gms.data.fetchFromServer.get('contact-info', '', onSuccess, onError);
	}
		
	this.addContact = function(contactObject, onSuccess, onError){
		if(contactObject) {
			var valid = true;	
			if(valid) {
				gms.data.fetchFromServer.post('contact-info', contactObject, onSuccess, onError);
			}
		}
	}
	
	this.updateContact = function(contactObject, onSuccess, onError){
		if(contactObject && contactObject.id) {
			gms.data.fetchFromServer.put('contact-info', contactObject, onSuccess, onError);
		} else {
			onError('Invalid Contact');
		}
	}
	
	this.deleteContact = function(contactObject, onSuccess, onError){
		if(contactObject && contactObject.id) {
			gms.data.fetchFromServer.del('contact-info', contactObject, onSuccess, onError);
		} else {
			onError('Invalid Contact');
		}
		
	}
	
	
})();
