/**
 * http://usejsdoc.org/
 */

/**
 * this function is used to save Model type data
 * 
 * @param {Schema} Model
 * @param {Model.Schema} data
 * @param {function} callback
 */
exports.save = function(Model, data, callback) {
	data.status = true;
	new Model(data).save(callback);
};

/**
 * this function is used to update Model type data
 * 
 * @param {Schema} Model
 * @param {Object} criteria
 * @param {Model.Schema} data
 * @param {function} callback
 */
exports.update = function(Model, criteria, data, callback) {
	criteria.status=true;
	
	delete data.created;
	delete data.updated;
	data.__v++;
	
	Model.findOneAndUpdate(criteria, {$set: data}, {overwrite: true}, callback);
};

/**
 * this function is used to get Model type data by criteria
 * 
 * @param {Schema} Model
 * @param {Object} criteria
 * @param {function} callback
 */
exports.getOne = function(Model, criteria, callback, selects) {
	if(selects) {
		Model.findOne(criteria).select(selects).exec(callback);
	} else {
		Model.findOne(criteria).exec(callback);
	}
};

/**
 * this function is used to delete Model type data
 * 
 * @param {Schema} Model
 * @param {Object} criteria
 * @param {function} callback
 */
exports.deleteOne = function(Model, criteria, callback) {
	criteria.status = true;
	Model.update(criteria, {status: false}, {multi: true}, callback);
};

/**
 * @param {Schema} Model
 * @param {Object} criteria
 * @param {String} projection
 * @Param {Object} option
 * @param {function} callback
 */
exports.query = function(Model, criteria, projection, option, callback) {
	Model.find(criteria, projection, option, callback);
};