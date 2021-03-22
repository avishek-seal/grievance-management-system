/**
 * http://usejsdoc.org/
 */

const MAILGUN_CONFIG = {
    MAILGUN_API_KEY : "key-3adc51b2aa6f439117ab2716b8c6a62a",
    DOMAIN_NAME : "mail.ddmemorialtrust.in",
    NO_REPLY_MAIL_ID : "DDMTrust<no-reply@mail.ddmemorialtrust.in>",
    REPLY_TO_MAIL_ID : "agniruddra.r@gmail.com",
};

exports.getNoReplyMailId = function() {
	return MAILGUN_CONFIG.NO_REPLY_MAIL_ID;
};

exports.getReplyToMailId = function() {
	return MAILGUN_CONFIG.REPLY_TO_MAIL_ID;
};

exports.getMailGunInit = function() {
	return 	{
				apiKey: MAILGUN_CONFIG.MAILGUN_API_KEY,
				domain: MAILGUN_CONFIG.DOMAIN_NAME
			};
};