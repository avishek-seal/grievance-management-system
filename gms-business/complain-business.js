/**
 * http://usejsdoc.org/
 */
var Complain = require('../gms-model/gms-model-complains.js');
var User = require('../gms-model/gms-model-users.js');
var repository = require('../gms-repo/generic-repository.js');
var ACTION = require('../gms-const/gms-constants.js').ACTION;
var emailSender = require('../gms-mail/mailgun-sender.js');

var LAST_COMPLAIN_COUNT = 0;

var COMPLAIN_SUBMISSION_MAIL_TEMPLATE = '<p>Dear #name</p>'
	+'<p>Thank you for submitting your Grievance in GMS.</p>'
	+'<p>Your Grievace ID is : #id</p>'
	+'<p></p>'
	+'<p>Thanks</p>'
	+'<p>Grievance Management System Team</p>';

var compainIdGenerator = function(name) {
	var now = new Date();
	var year = now.getYear() + 1900;
	var month = now.getMonth() + 1;
	var date = now.getDate();
	
	if(String(month).length === 1) {
		month = '0' + month;
	}
	
	if(String(date).length === 1) {
		date = '0' + date;
	}
	
	var identity = 'GMS-' + year + '-' + month + '-' + date + '-' + name.charAt(0).toUpperCase() + name.charAt(name.length - 1).toUpperCase() + now.getHours() + ''+now.getMinutes() + '' + now.getSeconds() + '' + now.getMilliseconds(); 
	
	return identity;
};

exports.save = function(complain, by, callback) {
	repository.getOne(User, {email : by}, function(err, user) {
		if(err) {
			callback(err);
		} else {
			complain.action = ACTION.SUBMITTED;
			complain.by = user;
			complain.identity = compainIdGenerator(user.name);
			
			repository.save(Complain, complain, function(err, resobject) {
				if(err) {
					callback(err);
				} else {
					var message = COMPLAIN_SUBMISSION_MAIL_TEMPLATE.replace("#name", user.name).replace("#id", resobject.identity);
					emailSender.send(user.email, 'GMS : Complain Submitted Successfully', message);
					callback(null, resobject);
				}
			});
		}
	}, 'email name');
};

exports.getAll = function(callback){
	Complain.find({}).populate({
	    path: 'by',
	    select: 'name email mobile address -_id'
	  }).exec(callback);
};

exports.get = function(email, callback) {
	repository.getOne(User, {'email' : email}, function(err, user) {
		Complain.find({'by' : user}).populate({
		    path: 'by',
		    select: 'name -_id'
		  }).exec(callback);
	});
};

exports.addComment = function(id, comment, callback) {
	repository.getOne(Complain, {identity : id}, function(err, doc) {
		if(err) {
			callback(err);
		} else {
			doc._doc.comments.push(comment);
			
			repository.update(Complain, {identity : id}, doc, function(err, obj) {
				if(err) {
					callback(err);
				} else {
					repository.getOne(Complain, {identity : id}, function(err, doc) {
						if(err) {
							callback(err);
						} else {
							callback(null, doc);
						}
					});
				}
			});
		}
	});
};
