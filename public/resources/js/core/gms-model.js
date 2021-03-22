/**
 * this class is used to create Academic information object
 * @constructor
 */
gms.model.Credential = function(email, password){
	this.email = email;
	this.password = password;
};

gms.model.User = function(email, password, name, mobile, address){
	this.email = email;
	this.password = password;
	this.name = name;
	this.mobile = mobile;
	this.address = address;
};

gms.model.Grievance = function(identity, summary, respondent, details, user, action, updated){
	this.identity = identity;
	this.summary = summary;
	this.respondent = respondent;
	this.details = details;
	this.by = user;
	this.action = action;
	this.updated = updated;
};

gms.model.Comment = function(identity, comment){
	this.identity = identity;
	this.comment = comment;
};