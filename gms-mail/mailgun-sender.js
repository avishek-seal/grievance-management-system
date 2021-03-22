/**
 * http://usejsdoc.org/
 */

var Mailgun = require('mailgun-js');
const MAIL_CONFIG = require('../gms-configuration/mail-configuration.js');
var mailgun = new Mailgun(MAIL_CONFIG.getMailGunInit());

exports.send = function (emailTo, subject, message, callback) {
	var data = {
    		from : MAIL_CONFIG.getNoReplyMailId(),
    		reply_to : MAIL_CONFIG.getReplyToMailId(),
    		to: emailTo,
            subject: subject,
            html: message
    };
    
    mailgun.messages().send(data, function (error, body) {
        if(callback) {
        	if (error) {
                callback(error);
            } else {
                callback(null, true);
            }
        }
    });
};
