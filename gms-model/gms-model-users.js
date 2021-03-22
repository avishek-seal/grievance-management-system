/**
 * http://usejsdoc.org/
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ROLE = require('../gms-const/gms-constants.js').ROLE;

/**
 * this Schema is used to maintain User information
 */
var UserSchema = new Schema({
	email : {type : String, required : true, unique : true, message: '{VALUE} is not a valid email!'},
	
	password : {type : String, required : true, message: '{VALUE} is not a valid Password'},
	
	role: {type: String, enum: [ROLE.APLICATION_USER, ROLE.ADMIN_USER], message: '{VALUE} is not a valid Role!'},
	
	name : {type : String, required : true},
	
	mobile : {type : String, required: true, unique: true, message: '{VALUE} is not a valid mobile number'},
	
	address : {type : String, required : false},
	
	verified: {type : Boolean, required : true},
	
	status : {type: Boolean, required: true, message: '{VALUE} is not a valid Status'},
	
	created : {type: Date, message: '{VALUE} is not a valid Create Date'},
	
	updated : {type: Date, message: '{VALUE} is not a valid Update Date'}
});

/**
 * audit callback for saving
 */
UserSchema.pre('save', function(next) {
    if(!this.created) {
    	this.created = new Date();
    }
    
    this.updated = new Date();

    next();
});

/**
 * audit callback for updating
 */
UserSchema.pre('update', function() {
  this.update({},{ $set: { updated: new Date() } });
});

module.exports = mongoose.model("User", UserSchema);