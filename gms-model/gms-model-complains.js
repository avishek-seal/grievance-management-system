/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ACTION = require('../gms-const/gms-constants.js').ACTION;

var ComplainSchema = new Schema({	
	identity : {type: String, required: true, unique: true},
	
	summary: {type: String, required: true},
	
	respondent : {type: String, required: true},
	
	details: {type: String, required: true},
	
	by : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	
	comments : [{type: String}],
	
	action : {type: Number, enum: [ACTION.SUBMITTED, ACTION.VIEWED, ACTION.APPROVED, ACTION.REJECTED]},
	
	status : {type: Boolean, required: true, message: '{VALUE} is not a valid Status'},
	
	created : {type: Date, message: '{VALUE} is not a valid Create Date'},
	
	updated : {type: Date, message: '{VALUE} is not a valid Update Date'}
});

/**
 * audit callback for saving
 */
ComplainSchema.pre('save', function(next) {
    if(!this.created) {
    	this.created = new Date();
    }
    
    this.updated = new Date();

    next();
});

/**
 * audit callback for updating
 */
ComplainSchema.pre('update', function() {
  this.update({},{ $set: { updated: new Date() } });
});

module.exports = mongoose.model("Complain", ComplainSchema);